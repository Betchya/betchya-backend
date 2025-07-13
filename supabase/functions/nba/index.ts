import { RouterBuilder, SupportedHttpMethod } from "../shared/RouterBuilder.ts";
import { NbaController } from "./controller/NbaController.ts";
import { NbaService } from "./service/NbaService.ts";
import { NbaSportsDataDAO } from "./dao/NbaSportsDataDAO.ts";
import { SupabaseDbDAO, SupabaseSchemaType } from "./dao/SupabaseDbDAO.ts";

// Dependency Injection for Services and DAOs needed by the current Edge Function for handling NBA related request
// Note: this index.ts file is responsible for the Controller Layer
const nbaSportsDataDAO = new NbaSportsDataDAO();
const nbaDAO = new SupabaseDbDAO(SupabaseSchemaType.NBA); // Use the enum value for the schema
const supabaseNbaService = new NbaService(nbaSportsDataDAO, nbaDAO);
const nbaController = new NbaController(supabaseNbaService);

const APP = RouterBuilder.builder()
  .withBasePath("/nba")
  /**
   * Resource Path: /nba/teams
   * Route/Endpoint to upsert NBA teams from Sportsdata.io to our in Supabase nba.teams DB Table.
  */
  .withRoute(
    SupportedHttpMethod.POST,
    "/teams", 
    nbaController.updateTeams.bind(nbaController),
  )
  //TODO add other NBA endpoints for handling players, games, etc. as needed
  .build();

Deno.serve(APP.fetch);