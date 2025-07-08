import { SportsDataNbaDAO } from "./dao/nba-sports-data-dao.ts";
import { SupabaseDbNbaDao, SupabaseSchemaType } from "./dao/nba-supabase-db-dao.ts";
import { SupabaseDbNbaService } from "./service/SupabaseNbaService.ts";
import { RouterBuilder, SupportedHttpMethod } from "../shared/RouterBuilder.ts";
import { Context } from "hono";

// Dependency Injection for Services and DAOs needed by the current Edge Function for handling NBA related request
// Note: this index.ts file is responsible for the Controller Layer
const sportsDataIoDAO = new SportsDataNbaDAO();
const nbaDAO = new SupabaseDbNbaDao(SupabaseSchemaType.NBA); // Use the enum value for the schema
const supabaseNbaService = new SupabaseDbNbaService(sportsDataIoDAO, nbaDAO);

const routerBuilder = new RouterBuilder("/nba");

/**
 * Resource Path: /nba/teams
 * Route/Endpoint to upsert NBA teams from Sportsdata.io to our in Supabase nba.teams DB Table.
 */
routerBuilder.addRoute(
  SupportedHttpMethod.POST,
  "/teams", 
  async (context: Context) => {
    try {
      const successMessage = await supabaseNbaService.syncNbaTeamData("teams", "teamid");
      return context.json({message: successMessage}, { status: 200 });
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        return context.json({message: `Failed to update NBA teams: ${error.message}`}, { status: 500 });
      } else {
        return context.json({message: "Failed to update NBA teams: Unknown error"}, { status: 500 });
      }
      }
  }
);

//TODO add other NBA endpoints for handling players, games, etc. as needed

Deno.serve(routerBuilder.getApp().fetch);