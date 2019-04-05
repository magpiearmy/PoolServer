use pool;

select player_name, count(gamesWon.won) as wins, count(gamesLost.won) as losses
from team_match_singles_game gamesWon, team_match_singles_game gamesLost
inner join gamesA
group by pl.player_name

select player.player_name, game.won, team.team_name as opponent_team
	from team_match_singles_game game
	inner join player on player.player_id = game.player_id
	left join team_match on team_match.match_id = game.match_id
	left join team on team.team_id <> player.team_id