import { Request } from 'supabase/types'; // Import the type declaration file for Supabase Edge Runtime
import { NbaSportsDataDAO } from "./dao/NbaSportsDataDAO.ts";
import { NbaSupabaseDbDAO, SupabaseSchemaType } from "./dao/NbaSupabaseDbDAO.ts";
import { SupabaseDbNbaService } from "./service/SupabaseNbaService.ts";

// Dependency Injection for Services and DAOs needed by the current Edge Function with index.ts being responsible for the Controller Layer
const sportsDataIoDAO = new NbaSportsDataDAO();
const nbaDAO = new NbaSupabaseDbDAO(SupabaseSchemaType.NBA); // Use the enum value for the schema
const supabaseNbaService = new SupabaseDbNbaService(sportsDataIoDAO, nbaDAO);

// Edge handler that pulls NBA Team data from SportsData.io and updates our nba.teams Supabase DB Table
Deno.serve(async (req: Request) => {
  // Only map POST requests to this endpoint
  if (req.method !== "POST") {
    return Response.json({message: "Method Not Allowed"}, { status: 405 });
  }

  try {
    //const successMessage = await updateNbaTeams(sportsDataIoDAO.getAllTeams, nbaDAO.upsertRecords<NbaTeamRecord>);
    const successMessage = await supabaseNbaService.syncNbaTeamData("teams", "teamid");
    return Response.json({message: successMessage}, { status: 200 });
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      return Response.json({message: `Failed to update NBA teams: ${error.message}`}, { status: 500 });
    } else {
      return Response.json({message: "Failed to update NBA teams: Unknown error"}, { status: 500 });
    }
  }
});
