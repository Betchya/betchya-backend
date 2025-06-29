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
  teamid: number;
  teamabbreviation: string;
  city: string;
  teamname: string;
  conference: string;
  division: string;
  active: boolean;
  recordlastupdated: string;
}

// const SPORTS_DATA_NBA_API_KEY = Deno.env.get('SPORTS_DATA_NBA_API_KEY') ?? '';
const NBA_TEAMS_API_URL = `https://api.sportsdata.io/v3/nba/scores/json/AllTeams?key=469421ea871a488eb5f670116668a83d`;

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
    typeof (team as any).TeamID === 'number' &&
    typeof (team as any).Key === 'string' &&
    typeof (team as any).City === 'string' &&
    typeof (team as any).Name === 'string' &&
    typeof (team as any).Conference === 'string' &&
    typeof (team as any).Division === 'string' &&
    typeof (team as any).Active === 'boolean'
  );
}

export function transformTeam(team: SportsDataTeam): TeamUpsertData {
  return {
    teamid: team.TeamID,
    teamabbreviation: team.Key,
    city: team.City,
    teamname: team.Name,
    conference: team.Conference,
    division: team.Division,
    active: team.Active,
    recordlastupdated: new Date().toISOString(),
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

    // Strictly filter out invalid teams
    const validTeams = teamsRaw.filter(isValidTeam);
    if (validTeams.length === 0) {
      console.error('No valid NBA teams found in API response.');
      return new Response('No valid NBA teams found in API response.', { status: 500 });
    }

    const upsertData = validTeams.map(transformTeam);

    const { error } = await upsertFn(upsertData);

    if (error) {
      console.error('Supabase upsert error:', error);
      const errorMsg = (typeof error === 'object' && error && 'message' in error)
        ? error.message
        : JSON.stringify(error);
      return new Response(`Database error: ${errorMsg}`, { status: 500 });
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
        const response = await fetch(NBA_TEAMS_API_URL);
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
        // Use all-lowercase, schema-qualified table name for Postgres compatibility
        // Consider using snake_case for all future schema/table/column names
        // Debug logging for upsert
        console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));
        console.log('SUPABASE_SERVICE_ROLE_KEY:', (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '').slice(0, 8) + '...');
        console.log('Upsert payload sample:', JSON.stringify(upsertData[0], null, 2));
        console.log('Upsert payload length:', upsertData.length);
        const { error, data } = await supabase.from('nba.teams').upsert(upsertData, { onConflict: 'teamid' });
        console.log('Upsert result:', { error, data });
        return { error, data };

      }
    );
  });
}
