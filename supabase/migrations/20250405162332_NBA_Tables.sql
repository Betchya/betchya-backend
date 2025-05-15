SET TIME ZONE 'UTC';

CREATE SCHEMA IF NOT EXISTS NBA;

-- Sportsdata.io recommends rerfreshing this table every 4 hours
CREATE TABLE NBA.Teams (
    TeamID INTEGER PRIMARY KEY,
    TeamAbbreviation VARCHAR(10) NOT NULL, -- e.g., "LAL" for Lakers
    City VARCHAR(50) NOT NULL, -- e.g., "Los Angeles"
    TeamName VARCHAR(50) NOT NULL, -- e.g., "Lakers"
    Conference VARCHAR(20), -- e.g., "Western"
    Division VARCHAR(20), -- e.g., "Pacific"
    Active BOOLEAN DEFAULT TRUE, -- Indicates if the team is currently active
    RecordLastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the last update with UTC timezone
);

-- Sportsdata.io recommends rerfreshing this table every 4 hours
CREATE TABLE NBA.Players (
    PlayerID INTEGER PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    TeamID INTEGER,
    Position VARCHAR(10), -- e.g., "PG", "SF"
    JerseyNumber INTEGER,
    PlayerHeight INTEGER, -- Height in inches
    PlayerWeight INTEGER, -- Weight in pounds
    BirthDate DATE,
    PlayerStatus VARCHAR(20) DEFAULT 'Active', -- e.g., "Active", "Injured"
    RecordLastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update with UTC timezone
    FOREIGN KEY (TeamID) REFERENCES NBA.Teams(TeamID)
);

-- Sportsdata.io recommends rerfreshing this table every 15 minutes during game days, or after game status changes
CREATE TABLE NBA.Games (
    GameID INTEGER PRIMARY KEY,
    GameDateTime TIMESTAMP WITH TIME ZONE NOT NULL, -- Game start time (in Eastern Time per API docs)
    GameStatus VARCHAR(20) NOT NULL, -- e.g., "Scheduled", "InProgress", "Final"
    HomeTeamID INTEGER NOT NULL,
    AwayTeamID INTEGER NOT NULL,
    Season INTEGER NOT NULL, -- e.g., 2025
    SeasonType VARCHAR(20) NOT NULL, -- e.g., "Regular", "Postseason"
    Venue VARCHAR(100), -- Game location
    RecordLastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update with UTC timezone
    FOREIGN KEY (HomeTeamID) REFERENCES NBA.Teams(TeamID),
    FOREIGN KEY (AwayTeamID) REFERENCES NBA.Teams(TeamID)
);

-- Sportsdata.io recommends rerfreshing this table every 15 minutes, or once after game completion
CREATE TABLE NBA.BoxScores (
    BoxScoreID SERIAL PRIMARY KEY,
    GameID INTEGER NOT NULL,
    TeamID INTEGER NOT NULL,
    Points INTEGER, -- Total points scored
    FieldGoalsMade INTEGER,
    FieldGoalsAttempted INTEGER,
    ThreePointersMade INTEGER,
    ThreePointersAttempted INTEGER,
    FreeThrowsMade INTEGER,
    FreeThrowsAttempted INTEGER,
    Rebounds INTEGER,
    Assists INTEGER,
    Steals INTEGER,
    Blocks INTEGER,
    Turnovers INTEGER,
    RecordLastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update with UTC timezone
    FOREIGN KEY (GameID) REFERENCES NBA.Games(GameID),
    FOREIGN KEY (TeamID) REFERENCES NBA.Teams(TeamID),
    UNIQUE (GameID, TeamID) -- Ensures one entry per team per game
);

-- Sportsdata.io recommends rerfreshing this table every 15 minutes during games, or once after game completion
CREATE TABLE NBA.PlayerGameStats (
    StatID SERIAL PRIMARY KEY,
    GameID INTEGER NOT NULL,
    PlayerID INTEGER NOT NULL,
    TeamID INTEGER NOT NULL,
    MinutesPlayed NUMERIC(5,2), -- e.g., 34.50 minutes
    Points INTEGER,
    FieldGoalsMade INTEGER,
    FieldGoalsAttempted INTEGER,
    ThreePointersMade INTEGER,
    ThreePointersAttempted INTEGER,
    FreeThrowsMade INTEGER,
    FreeThrowsAttempted INTEGER,
    Rebounds INTEGER,
    Assists INTEGER,
    Steals INTEGER,
    Blocks INTEGER,
    Turnovers INTEGER,
    FantasyPoints NUMERIC(5,2), -- Fantasy points (e.g., FanDuel/DraftKings)
    IsStarter BOOLEAN DEFAULT FALSE, -- From lineup data
    InjuryStatus VARCHAR(20), -- e.g., "Questionable", "Out"
    RecordLastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update with UTC timezone
    CONSTRAINT fk_game FOREIGN KEY (GameID) REFERENCES NBA.Games(GameID),
    CONSTRAINT fk_player FOREIGN KEY (PlayerID) REFERENCES NBA.Players(PlayerID),
    CONSTRAINT fk_team FOREIGN KEY (TeamID) REFERENCES NBA.Teams(TeamID),
    CONSTRAINT unique_game_player UNIQUE (GameID, PlayerID) -- One entry per player per game
);

-- Sportsdata.io recommends rerfreshing this table every 10 minutes pre-game, and every 15 minutes during games
CREATE TABLE NBA.Projections (
    ProjectionID SERIAL PRIMARY KEY,
    GameID INTEGER NOT NULL,
    PlayerID INTEGER NOT NULL,
    TeamID INTEGER NOT NULL,
    ProjectedMinutes NUMERIC(5,2),
    ProjectedPoints NUMERIC(5,2),
    ProjectedRebounds NUMERIC(5,2),
    ProjectedAssists NUMERIC(5,2),
    ProjectedSteals NUMERIC(5,2),
    ProjectedBlocks NUMERIC(5,2),
    ProjectedTurnovers NUMERIC(5,2),
    ProjectedFantasyPoints NUMERIC(5,2),
    ProjectionLastUpdated TIMESTAMP WITH TIME ZONE, -- Tracks projection sync time
    RecordLastUpdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update with UTC timezone
    CONSTRAINT fk_game FOREIGN KEY (GameID) REFERENCES NBA.Games(GameID),
    CONSTRAINT fk_player FOREIGN KEY (PlayerID) REFERENCES NBA.Players(PlayerID),
    CONSTRAINT fk_team FOREIGN KEY (TeamID) REFERENCES NBA.Teams(TeamID),
    CONSTRAINT unique_projection_game_player UNIQUE (GameID, PlayerID) -- One projection per player per game
);