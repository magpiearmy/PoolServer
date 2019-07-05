const database = require('./database.js')

exports.getAllPlayers = function (handleResult) {
  const db = database.getConnection();

  const query = 'select * from player;';
  console.log('Attempting to retrieve all players from database');
  db.query(query, function (err, results) {
    if (err) {
      console.error('Failed to get players');
    } else {
      console.log('Success! Results: [%s]' + results);
      handleResult(results);
    }
  });
}

exports.getPlayerByName = function (name, handleResult) {
  const db = database.getConnection();

  console.log('Attempting to retrieve player with name: ' + name);
  const query = 'select * from player where player_name = ?';
  db.query(query, name, function (err, results) {
    if (err) {
      console.log('Failed to get player by name: ' + name);
      throw err;
    }
    console.log('Successful query! Results: ' + results);
    handleResult(results);
  });
}

exports.getAllMatches = function (handleResult) {
  const db = database.getConnection();

  console.log('Attempting to retrieve all matches');
  const query = 'select * from team_match where home_team_id = 1';
  db.query(query, function (err, results) {
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
        from team_match_singles_game game, player pl
        where game.player_id=pl.player_id and pl.player_id=?`;
  db.query(query, playerId, function (err, results) {
    if (err) {
      console.log('Failed to retrieve matches for player: ' + err);
      throw err;
    }
    handleResult(results);
  });
}

exports.createNewMatch = function (teamId, homeScore, awayScore, games, handleResult) {
  const db = database.getConnection();
  
  const query = 'insert into team_match (home_team_id, home_score, away_score) values (?, ?, ?)';
  console.log('Attempting to create match: ' + homeScore + ' - ' + awayScore);

  db.beginTransaction(function doTransaction(err) {

    db.query(query, [teamId, homeScore, awayScore], function (err, results) {

      if (err) {
        console.log('Error creating team match, attempting to rollback');
        return db.rollback(function () {
          throw err;
        });
      }

      let matchId = results.insertId;
      console.log('Created team match with id: ' + matchId);
      console.log('Attempting to create games for match: ' + matchId);

      createSinglesAndDoublesGames(games, matchId, function (err, results) {
        if (err) {
          console.warn('Error creating singles and doubles games for match: ' + matchId);
          console.log('Attempting to rollback');
          return db.rollback(function () {
            console.log('Rolled back successfully');
            throw err;
          });
        }

        console.log('Created singles and doubles games. Attempting to commit.')
        db.commit(function (err) {
          if (err) {
            console.warn('Error on committing singles and doubles games');
            console.log('Attempting to rollback');
            return connection.rollback(function () {
              console.log('Rolled back successfully');
              throw err;
            });
          }

          console.log('Created singles and doubles games for match: ' + matchId);
          handleResult(err, results);
        });
      });
    });
  })
}

function createSinglesAndDoublesGames(games, matchId, handleResult) {

  const singlesGames = [];
  const doublesGames = [];
  games.forEach((game, index) => {
    if (game.type = 'singles') {
      singlesGames.push([
        matchId,
        game.player_id,
        index,
        game.won,
        game.seven_ball
      ]);
    } else if (nextGame.type = 'doubles') {
      doublesGames.push([
        matchId,
        game.playerone_id,
        game.playertwo_id,
        index,
        game.won,
        game.seven_ball
      ]);
    }
  });

  createSinglesMatchRecord(singlesGames, handleResult);
}

function createSinglesMatchRecord(values, handleResult) {
  const db = database.getConnection();
  
  const query = 'INSERT INTO pool.team_match_singles_game \
      (match_id, player_id, match_number, won, seven_ball) \
      VALUES  ?';

  db.query(query, [values], function (err, result) {
    handleResult(err, result);
  });
}