import { Request } from 'supabase/types'; // Import the type declaration file for Supabase Edge Runtime
import { SportsDataNbaDAO } from "./dao/nba-sports-data-dao.ts";
import { SupabaseDbNbaDao } from "./dao/nba-supabase-db-dao.ts";
import { SupabaseDbNbaService } from "./service/SupabaseNbaService.ts";

// Dependency Injection for Services and DAOs needed by the current Edge Function with index.ts being responsible for the Controller Layer
const sportsDataIoDAO = new SportsDataNbaDAO();
const nbaDAO = new SupabaseDbNbaDao();
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json({message: `Failed to update NBA teams: ${errorMessage}`}, { status: 500 });
  }
});
