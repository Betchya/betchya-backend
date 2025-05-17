// Import Supabase client and HTTP server
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

// Supabase client is now created inside the handler, per Supabase best practices.

// Types for SportsData.io NBA Team response
interface SportsDataTeam {
  TeamID: number;
  Key: string;
  City: string;
  Name: string;
  Conference: string;
  Division: string;
  Active: boolean;
}

export interface TeamUpsertData {
  TeamID: number;
  TeamAbbreviation: string;
  City: string;
  TeamName: string;
  Conference: string;
  Division: string;
  Active: boolean;
  RecordLastUpdated: string;
}

const SPORTS_DATA_NBA_API_KEY = Deno.env.get('SPORTS_DATA_NBA_API_KEY') ?? '';
const NBA_TEAMS_API_URL = 'https://api.sportsdata.io/v3/nba/scores/json/teams';

export function isValidTeam(team: unknown): team is SportsDataTeam {
  return (
    typeof team === 'object' &&
    team !== null &&
    'TeamID' in team &&
    'Key' in team &&
    'City' in team &&
    'Name' in team &&
    'Conference' in team &&
    'Division' in team &&
    'Active' in team &&
    typeof team.TeamID === 'number' &&
    typeof team.Key === 'string' &&
    typeof team.City === 'string' &&
    typeof team.Name === 'string' &&
    typeof team.Conference === 'string' &&
    typeof team.Division === 'string' &&
    typeof team.Active === 'boolean'
  );
}

export function transformTeam(team: SportsDataTeam): TeamUpsertData {
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

// Extracted main logic for easier unit testing
export async function updateNbaTeams(
  fetchTeams: () => Promise<unknown[]>,
  upsertFn: (teams: TeamUpsertData[]) => Promise<{ error: { message: string } | null }>
): Promise<Response> {
  try {
    const teamsRaw = await fetchTeams();

    if (!Array.isArray(teamsRaw)) {
      console.error('Invalid API response: expected array of teams');
      return new Response('Invalid API response: expected array of teams', { status: 500 });
    }

    // Type-safe filter and collect invalids
    const validTeams: SportsDataTeam[] = [];
    const invalidTeams: unknown[] = [];
    for (const team of teamsRaw) {
      if (isValidTeam(team)) {
        validTeams.push(team);
      } else {
        invalidTeams.push(team);
      }
    }

    if (invalidTeams.length > 0) {
      console.error('Invalid team data received from API:', invalidTeams[0]);
      return new Response(`Invalid team data received from API: ${JSON.stringify(invalidTeams[0])}`, { status: 500 });
    }

    const upsertData = validTeams.map(transformTeam);

    const { error } = await upsertFn(upsertData);

    if (error) {
      console.error('Supabase upsert error:', error);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    }

    return new Response('NBA teams updated successfully.', { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Unexpected error:', err);
    return new Response(`Failed to update NBA teams: ${message}`, { status: 500 });
  }
}

// Edge handler uses updateNbaTeams with real fetch and Supabase
if (import.meta.main) {
  serve((_req) => {
    return updateNbaTeams(
      async () => {
        const response = await fetch(NBA_TEAMS_API_URL, {
          headers: {
            'Ocp-Apim-Subscription-Key': SPORTS_DATA_NBA_API_KEY,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch NBA teams: ${response.status} ${response.statusText}`);
        }
        return await response.json();
      },
      async (upsertData) => {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        return await supabase.from('NBA.Teams').upsert(upsertData, { onConflict: 'TeamID' });
      }
    );
  });
}
