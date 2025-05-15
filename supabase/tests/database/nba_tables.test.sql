begin;
select plan(67); -- Adjust the number based on the total number of tests

-- Test for nba.teams table
SELECT has_column('nba', 'teams', 'teamid', 'teamid should exist in nba.teams');
SELECT has_column('nba', 'teams', 'teamabbreviation', 'teamabbreviation should exist in nba.teams');
SELECT has_column('nba', 'teams', 'city', 'city should exist in nba.teams');
SELECT has_column('nba', 'teams', 'teamname', 'teamname should exist in nba.teams');
SELECT has_column('nba', 'teams', 'conference', 'conference should exist in nba.teams');
SELECT has_column('nba', 'teams', 'division', 'division should exist in nba.teams');
SELECT has_column('nba', 'teams', 'active', 'active should exist in nba.teams');
SELECT has_column('nba', 'teams', 'recordlastupdated', 'recordlastupdated should exist in nba.teams');

-- Test for nba.players table
SELECT has_column('nba', 'players', 'playerid', 'playerid should exist in nba.players');
SELECT has_column('nba', 'players', 'firstname', 'firstname should exist in nba.players');
SELECT has_column('nba', 'players', 'lastname', 'lastname should exist in nba.players');
SELECT has_column('nba', 'players', 'teamid', 'teamid should exist in nba.players');
SELECT has_column('nba', 'players', 'position', 'position should exist in nba.players');
SELECT has_column('nba', 'players', 'jerseynumber', 'jerseynumber should exist in nba.players');
SELECT has_column('nba', 'players', 'playerheight', 'playerheight should exist in nba.players');
SELECT has_column('nba', 'players', 'playerweight', 'playerweight should exist in nba.players');
SELECT has_column('nba', 'players', 'birthdate', 'birthdate should exist in nba.players');
SELECT has_column('nba', 'players', 'playerstatus', 'playerstatus should exist in nba.players');
SELECT has_column('nba', 'players', 'recordlastupdated', 'recordlastupdated should exist in nba.players');

-- Test for nba.games table
SELECT has_column('nba', 'games', 'gameid', 'gameid should exist in nba.games');
SELECT has_column('nba', 'games', 'gamedatetime', 'gamedatetime should exist in nba.games');
SELECT has_column('nba', 'games', 'gamestatus', 'gamestatus should exist in nba.games');
SELECT has_column('nba', 'games', 'hometeamid', 'hometeamid should exist in nba.games');
SELECT has_column('nba', 'games', 'awayteamid', 'awayteamid should exist in nba.games');
SELECT has_column('nba', 'games', 'season', 'season should exist in nba.games');
SELECT has_column('nba', 'games', 'seasontype', 'seasontype should exist in nba.games');
SELECT has_column('nba', 'games', 'venue', 'venue should exist in nba.games');
SELECT has_column('nba', 'games', 'recordlastupdated', 'recordlastupdated should exist in nba.games');

-- Test for nba.boxscores table
SELECT has_column('nba', 'boxscores', 'boxscoreid', 'boxscoreid should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'gameid', 'gameid should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'teamid', 'teamid should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'points', 'points should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'fieldgoalsmade', 'fieldgoalsmade should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'fieldgoalsattempted', 'fieldgoalsattempted should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'threepointersmade', 'threepointersmade should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'threepointersattempted', 'threepointersattempted should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'freethrowsmade', 'freethrowsmade should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'freethrowsattempted', 'freethrowsattempted should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'rebounds', 'rebounds should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'assists', 'assists should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'steals', 'steals should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'blocks', 'blocks should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'turnovers', 'turnovers should exist in nba.boxscores');
SELECT has_column('nba', 'boxscores', 'recordlastupdated', 'recordlastupdated should exist in nba.boxscores');

-- Test for nba.playergamestats table
SELECT has_column('nba', 'playergamestats', 'statid', 'statid should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'gameid', 'gameid should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'playerid', 'playerid should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'teamid', 'teamid should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'minutesplayed', 'minutesplayed should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'fantasypoints', 'fantasypoints should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'isstarter', 'isstarter should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'injurystatus', 'injurystatus should exist in nba.playergamestats');
SELECT has_column('nba', 'playergamestats', 'recordlastupdated', 'recordlastupdated should exist in nba.playergamestats');

-- Test for nba.projections table
SELECT has_column('nba', 'projections', 'projectionid', 'projectionid should exist in nba.projections');
SELECT has_column('nba', 'projections', 'gameid', 'gameid should exist in nba.projections');
SELECT has_column('nba', 'projections', 'playerid', 'playerid should exist in nba.projections');
SELECT has_column('nba', 'projections', 'teamid', 'teamid should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedminutes', 'projectedminutes should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedpoints', 'projectedpoints should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedrebounds', 'projectedrebounds should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedassists', 'projectedassists should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedsteals', 'projectedsteals should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedblocks', 'projectedblocks should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedturnovers', 'projectedturnovers should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectedfantasypoints', 'projectedfantasypoints should exist in nba.projections');
SELECT has_column('nba', 'projections', 'projectionlastupdated', 'projectionlastupdated should exist in nba.projections');
SELECT has_column('nba', 'projections', 'recordlastupdated', 'recordlastupdated should exist in nba.projections');

rollback;