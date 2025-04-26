begin;
select plan(27); -- Adjust the number based on the total number of tests

-- Test for NBA.Teams table
SELECT has_column(
    'NBA',
    'Teams',
    'TeamID',
    'TeamID should exist in NBA.Teams'
);
SELECT has_column(
    'NBA',
    'Teams',
    'TeamName',
    'TeamName should exist in NBA.Teams'
);
SELECT has_column(
    'NBA',
    'Teams',
    'City',
    'City should exist in NBA.Teams'
);
SELECT has_column(
    'NBA',
    'Teams',
    'Conference',
    'Conference should exist in NBA.Teams'
);

-- Test for NBA.Players table
SELECT has_column(
    'NBA',
    'Players',
    'PlayerID',
    'PlayerID should exist in NBA.Players'
);
SELECT has_column(
    'NBA',
    'Players',
    'PlayerName',
    'PlayerName should exist in NBA.Players'
);
SELECT has_column(
    'NBA',
    'Players',
    'TeamID',
    'TeamID should exist in NBA.Players'
);
SELECT has_column(
    'NBA',
    'Players',
    'Position',
    'Position should exist in NBA.Players'
);

-- Test for NBA.Games table
SELECT has_column(
    'NBA',
    'Games',
    'GameID',
    'GameID should exist in NBA.Games'
);
SELECT has_column(
    'NBA',
    'Games',
    'GameDateTime',
    'GameDateTime should exist in NBA.Games'
);
SELECT has_column(
    'NBA',
    'Games',
    'HomeTeamID',
    'HomeTeamID should exist in NBA.Games'
);
SELECT has_column(
    'NBA',
    'Games',
    'AwayTeamID',
    'AwayTeamID should exist in NBA.Games'
);

-- Test for NBA.BoxScores table
SELECT has_column(
    'NBA',
    'BoxScores',
    'BoxScoreID',
    'BoxScoreID should exist in NBA.BoxScores'
);
SELECT has_column(
    'NBA',
    'BoxScores',
    'GameID',
    'GameID should exist in NBA.BoxScores'
);
SELECT has_column(
    'NBA',
    'BoxScores',
    'PlayerID',
    'PlayerID should exist in NBA.BoxScores'
);
SELECT has_column(
    'NBA',
    'BoxScores',
    'Points',
    'Points should exist in NBA.BoxScores'
);
SELECT has_column(
    'NBA',
    'BoxScores',
    'Rebounds',
    'Rebounds should exist in NBA.BoxScores'
);

-- Test for NBA.PlayerGameStats table
SELECT has_column(
    'NBA',
    'PlayerGameStats',
    'StatID',
    'StatID should exist in NBA.PlayerGameStats'
);
SELECT has_column(
    'NBA',
    'PlayerGameStats',
    'GameID',
    'GameID should exist in NBA.PlayerGameStats'
);
SELECT has_column(
    'NBA',
    'PlayerGameStats',
    'PlayerID',
    'PlayerID should exist in NBA.PlayerGameStats'
);
SELECT has_column(
    'NBA',
    'PlayerGameStats',
    'Points',
    'Points should exist in NBA.PlayerGameStats'
);
SELECT has_column(
    'NBA',
    'PlayerGameStats',
    'Assists',
    'Assists should exist in NBA.PlayerGameStats'
);

-- Test for NBA.Projections table
SELECT has_column(
    'NBA',
    'Projections',
    'ProjectionID',
    'ProjectionID should exist in NBA.Projections'
);
SELECT has_column(
    'NBA',
    'Projections',
    'PlayerID',
    'PlayerID should exist in NBA.Projections'
);
SELECT has_column(
    'NBA',
    'Projections',
    'ProjectedPoints',
    'ProjectedPoints should exist in NBA.Projections'
);
SELECT has_column(
    'NBA',
    'Projections',
    'ProjectedRebounds',
    'ProjectedRebounds should exist in NBA.Projections'
);
SELECT has_column(
    'NBA',
    'Projections',
    'ProjectedAssists',
    'ProjectedAssists should exist in NBA.Projections'
);

rollback;