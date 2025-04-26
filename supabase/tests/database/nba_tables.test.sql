begin;
select plan(27); -- Adjust the number based on the total number of tests

-- Test for nba.teams table
SELECT has_column(
    'nba',
    'teams',
    'teamid',
    'teamid should exist in nba.teams'
);
SELECT has_column(
    'nba',
    'teams',
    'teamname',
    'teamname should exist in nba.teams'
);
SELECT has_column(
    'nba',
    'teams',
    'city',
    'city should exist in nba.teams'
);
SELECT has_column(
    'nba',
    'teams',
    'conference',
    'conference should exist in nba.teams'
);

-- Test for nba.players table
SELECT has_column(
    'nba',
    'players',
    'playerid',
    'playerid should exist in nba.players'
);
SELECT has_column(
    'nba',
    'players',
    'playername',
    'playername should exist in nba.players'
);
SELECT has_column(
    'nba',
    'players',
    'teamid',
    'teamid should exist in nba.players'
);
SELECT has_column(
    'nba',
    'players',
    'position',
    'position should exist in nba.players'
);

-- Test for nba.games table
SELECT has_column(
    'nba',
    'games',
    'gameid',
    'gameid should exist in nba.games'
);
SELECT has_column(
    'nba',
    'games',
    'gamedatetime',
    'gamedatetime should exist in nba.games'
);
SELECT has_column(
    'nba',
    'games',
    'hometeamid',
    'hometeamid should exist in nba.games'
);
SELECT has_column(
    'nba',
    'games',
    'awayteamid',
    'awayteamid should exist in nba.games'
);

-- Test for nba.boxscores table
SELECT has_column(
    'nba',
    'boxscores',
    'boxscoreid',
    'boxscoreid should exist in nba.boxscores'
);
SELECT has_column(
    'nba',
    'boxscores',
    'gameid',
    'gameid should exist in nba.boxscores'
);
SELECT has_column(
    'nba',
    'boxscores',
    'playerid',
    'playerid should exist in nba.boxscores'
);
SELECT has_column(
    'nba',
    'boxscores',
    'points',
    'points should exist in nba.boxscores'
);
SELECT has_column(
    'nba',
    'boxscores',
    'rebounds',
    'rebounds should exist in nba.boxscores'
);

-- Test for nba.playergamestats table
SELECT has_column(
    'nba',
    'playergamestats',
    'statid',
    'statid should exist in nba.playergamestats'
);
SELECT has_column(
    'nba',
    'playergamestats',
    'gameid',
    'gameid should exist in nba.playergamestats'
);
SELECT has_column(
    'nba',
    'playergamestats',
    'playerid',
    'playerid should exist in nba.playergamestats'
);
SELECT has_column(
    'nba',
    'playergamestats',
    'points',
    'points should exist in nba.playergamestats'
);
SELECT has_column(
    'nba',
    'playergamestats',
    'assists',
    'assists should exist in nba.playergamestats'
);

-- Test for nba.projections table
SELECT has_column(
    'nba',
    'projections',
    'projectionid',
    'projectionid should exist in nba.projections'
);
SELECT has_column(
    'nba',
    'projections',
    'playerid',
    'playerid should exist in nba.projections'
);
SELECT has_column(
    'nba',
    'projections',
    'projectedpoints',
    'projectedpoints should exist in nba.projections'
);
SELECT has_column(
    'nba',
    'projections',
    'projectedrebounds',
    'projectedrebounds should exist in nba.projections'
);
SELECT has_column(
    'nba',
    'projections',
    'projectedassists',
    'projectedassists should exist in nba.projections'
);

rollback;