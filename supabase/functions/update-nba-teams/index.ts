// Import Supabase client and HTTP server
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

// Create Supabase client using environment variables
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// SportsData.io API configuration
const SPORTS_DATA_NBA_API_KEY = Deno.env.get('SPORTS_DATA_NBA_API_KEY') ?? '';
const NBA_TEAMS_API_URL = 'https://api.sportsdata.io/v3/nba/scores/json/teams';

// Validate the shape and types of a team object
function isValidTeam(team: any): boolean {
  return (
    typeof team.TeamID === 'number' &&
    typeof team.Key === 'string' &&
    typeof team.City === 'string' &&
    typeof team.Name === 'string' &&
    typeof team.Conference === 'string' &&
    typeof team.Division === 'string' &&
    typeof team.Active === 'boolean'
  );
}

// Transform SportsData.io team format to our database format
function transformTeam(team: any): any {
  return {
    TeamID: team.TeamID,
    TeamAbbreviation: team.Key,
    City: team.City,
    TeamName: team.Name,
    Conference: team.Conference,
    Division: team.Division,
    Active: team.Active,
    RecordLastUpdated: new Date().toISOString(),
  };
}

// Handle HTTP requests
serve(async (_req) => {
  try {
    // Fetch teams from SportsData.io
    const response = await fetch(NBA_TEAMS_API_URL, {
      headers: {
        'Ocp-Apim-Subscription-Key': SPORTS_DATA_NBA_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch NBA teams: ${response.statusText}`);
    }

    const teams = await response.json();

    // Validate API response
    if (!Array.isArray(teams)) {
      throw new Error('Invalid API response: expected array of teams');
    }

    const invalid = teams.filter((team) => !isValidTeam(team));
    if (invalid.length > 0) {
      throw new Error(`Invalid team data received from API: ${JSON.stringify(invalid[0])}`);
    }

    // Transform data to our format
    const upsertData = teams.map(transformTeam);

    // Upsert into Supabase
    const { error } = await supabase.from('NBA.Teams').upsert(upsertData, {
      onConflict: 'TeamID',
    });

    if (error) {
      throw error;
    }

    return new Response('NBA teams updated successfully.', { status: 200 });

  } catch (err) {
    console.error('Error:', err);
    return new Response(`Failed to update NBA teams: ${err.message}`, { status: 500 });
  }
});
