// Import Supabase client and the Deno HTTP server is provided by Deno's standard library, so use Deno.serve directly.
// Supabase client is now created inside the handler, per Supabase best practices.
import { createClient } from 'supabase';
import { Request } from 'supabase/types'; // Import the type declaration file for Supabase Edge Runtime
import { UpsertRecordsFunction } from "./types.ts";
import { mapTeamToDBRecord } from "./util/mapper.ts";
import { isValidTeam } from "./util/validator.ts";

const SPORTS_DATA_NBA_API_KEY = Deno.env.get('SPORTS_DATA_NBA_API_KEY') ?? '';
const NBA_TEAMS_API_URL = `https://api.sportsdata.io/v3/nba/scores/json/AllTeams?key=${SPORTS_DATA_NBA_API_KEY}`;

// Named function to fetch NBA teams from the API
const fetchNbaTeams = async (): Promise<unknown[]> => {
  console.log('Fetching NBA teams from Sportsdata.io API:', NBA_TEAMS_API_URL);
  const response = await fetch(NBA_TEAMS_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch NBA teams from Sportsdata.io ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// Named function to upsert NBA teams into Supabase
const upsertNbaTeamRecords : UpsertRecordsFunction = async (upsertData) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  // Debug logging for upsert
  console.log(`${Deno.env.get('SUPABASE_ANON_KEY')}`);
  console.log('Upsert payload sample:', JSON.stringify(upsertData[0], null, 2));
  console.log('Upsert payload length:', upsertData.length);

  // Perform the upsert operation
  const { data, error } = await supabase.schema('nba').from('teams').upsert(upsertData, { onConflict: 'teamid' });
  console.log('Upsert NBA Teams result:', { data, error });

  return { data, error };
};

// Extracted main logic for easier unit testing
export const updateNbaTeams = async (
  fetchData: () => Promise<unknown[]>,
  upsertRecords : UpsertRecordsFunction
): Promise<string> => {
  try {
    const nbaTeamsResponse = await fetchData();
    if (!Array.isArray(nbaTeamsResponse)) {
      throw new Error('Invalid API response: expected array of teams');
    }

    // Strictly filter out invalid teams
    const validatedTransformedTeams = nbaTeamsResponse.filter(isValidTeam).map(mapTeamToDBRecord);
    if (validatedTransformedTeams.length === 0) {
      throw new Error('No valid NBA teams found in API response.');
    }

    const { error } = await upsertRecords(validatedTransformedTeams);
    if (error) {
      const errorMsg = (typeof error === 'object' && error && 'message' in error)
        ? error.message
        : JSON.stringify(error);
      throw new Error(`Database error ${errorMsg}`);
    }

    return 'NBA teams updated successfully.';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Failed to update NBA teams: ${message}`;
  }
};

// Edge handler that pulls NBA Team data from SportsData.io and updates our nba.teams Supabase DB Table
Deno.serve(async (req: Request) => {
  // Only map POST requests to this endpoint
  if (req.method !== "POST") {
    return Response.json({message: "Method Not Allowed"}, { status: 405 });
  }

  try {
    const successMessage = await updateNbaTeams(fetchNbaTeams, upsertNbaTeamRecords);
    return Response.json({message: successMessage}, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json({message: `Failed to update NBA teams: ${errorMessage}`}, { status: 500 });
  }
});
