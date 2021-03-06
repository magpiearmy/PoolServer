const database = require('./database.js')

function query(db, sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, result) => {
      if (err) {
        console.error('Query error');
        reject(err);
      } else {
        console.log('Query success');
        resolve(result);
      }
    })
  });
}

function transactional(doTransaction) {
  const db = database.getConnection();
  return new Promise((resolve, reject) => {
    console.log('Starting transaction')
    db.beginTransaction((err) => doTransaction(db, resolve, reject));
  })
    .then((result) => {
      console.log('Committing transaction');
      db.commit((err) => {
        if (err) {
          console.error("Failed to commit transaction");
          throw err;
        };
        console.log('Committed transaction');
      });

      return result;
    })
    .catch((err) => {
      console.log('Rolling back transaction');
      db.rollback((rollbackErr) => {
        if (rollbackErr) {
          console.error("Failed to rollback database transaction");
          throw rollbackErr;
        }
        console.log('Rolled back transaction');
      })
      throw err;
    });
}

exports.getPlayersByTeamId = function (teamId, handleResult) {
  console.log('Attempting to retrieve players for team [%s]', teamId);

  const db = database.getConnection();

  const query = 'select * from player where team_id = ?;';
  db.query(query, teamId, function (err, results) {
    if (err) {
      console.error('Failed to get players');
    } else {
      console.log('Success! Results: [%s]', results);
      handleResult(results);
    }
  });
}

exports.getPlayerById = function (playerId, handleResult) {
  console.log('Attempting to retrieve player by ID [%s]', playerId);

  const db = database.getConnection();

  const query = 'select * from player where player_id = ?'
  db.query(query, playerId, function (err, results) {
    if (err) {
      console.log('Failed to get player by ID');
      throw err;
    }
    console.log('Successful query! Results [%s]', results);
    handleResult(results);
  });
}

exports.getPlayerByName = function (name, handleResult) {
  console.log('Attempting to retrieve player with name: ' + name);

  const db = database.getConnection();

  const query = 'select * from player where player_name = ?'
  db.query(query, name, function (err, results) {
    if (err) {
      console.log('Failed to get player by name: ' + name);
      throw err;
    }
    console.log('Successful query! Results: ' + results);
    handleResult(results);
  });
}

exports.getMatchesByTeamId = function (teamId, handleResult) {
  console.log('Attempting to retrieve all matches');

  const db = database.getConnection();

  const query = 'select * from team_match where home_team_id = ? or away_team_id = ?';
  db.query(query, [teamId, teamId], function (err, results) {
    if (err) {
      console.log('Failed to retrieve all matches');
      throw err;
    }
    handleResult(results);
  });
}

exports.getSinglesMatchesByPlayerId = function (playerId, handleResult) {
  const db = database.getConnection();

  console.log('Attempting to retrieve singles matches for player');
  const query = `select *
        from team_match_singles_game game, player
        where game.player_id=pl.player_id and player.player_id=?`;
  db.query(query, playerId, function (err, results) {
    if (err) return console.error('Failed to retrieve matches for player: ' + err);
    handleResult(results);
  });
}

exports.createMatch = function (match, onResult) {
  let matchId;
  transactional((db, commit, rollback) => {
    return insertMatchRecord(db, match)
      .then(result => matchId = result.insertId)
      .then(() => insertSinglesGamesRecords(db, match.games, matchId))
      .then(() => insertDoublesGamesRecords(db, match.games, matchId))
      .then(() => commit())
      .catch((err) => rollback())
  })
    .then((result) => {
      console.log("Successfully created match")
      onResult(null, result)
    })
    .catch((err) => {
      console.log("Failed to create match")
      onResult(err, null);
    })
}

function insertMatchRecord(db, match) {
  console.log('Creating match record');

  const querySql = 'insert into team_match (home_team_id, home_score, away_score) values (?, ?, ?)';
  const queryArgs = [
    match.teamId,
    match.homeScore,
    match.awayScore
  ]

  return query(db, querySql, queryArgs);
}

function insertSinglesGamesRecords(db, games, matchId) {
  const querySql = 'INSERT INTO pool.team_match_singles_game \
      (match_id, home_player_id, away_player_id, match_number, home_win, seven_ball) \
      VALUES ?';

  const records = games
    .filter((game) => game.type === 'singles')
    .map((game, index) => [
      matchId,
      game.homePlayerId,
      game.awayPlayerId,
      index,
      game.homeWin,
      game.sevenBall
    ]);

  console.log('Creating singles games')

  return query(db, querySql, [records]);
}

function insertDoublesGamesRecords(db, games, matchId) {
  const querySql = 'INSERT INTO pool.team_match_singles_game \
      (match_id, home_player_id, away_player_id, match_number, home_win, seven_ball) \
      VALUES ?';

  const records = games
    .filter((game) => game.type === 'doubles')
    .map((game, index) => [
      matchId,
      game.playerOneId,
      game.playerTwoId,
      index,
      game.won,
      game.sevenBall
    ]);

  console.log('Creating doubles games')

  return query(db, querySql, [records]);
}