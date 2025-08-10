import { SportsDataTeamRO } from "../ro/SportsDataTeamRO.ts"; // Import the type for SportsData.io NBA Team response
import { SportsDataPlayerRO } from "../ro/SportsDataPlayerRO.ts"; // Import the type for SportsData.io NBA Player response
import * as EnvironmentVariables from "../../shared/EnvironmentVariables.ts"; // Import environment variables

class NbaSportsDataDAO {
  private readonly apiKey: string;
  private readonly sportsDataBasePath: string = "https://api.sportsdata.io/v3/nba/scores/json";
  private readonly allTeamsEndpoint: URL;
  private readonly activePlayersEndpoint: URL;

  constructor() {
    //TODO Is this just for NBA data, or is it a single client API Key for all SportsData.io data?
    this.apiKey = EnvironmentVariables.SPORTS_DATA_API_KEY!;

    // NBA All Teams endpoint
    this.allTeamsEndpoint = new URL(`${this.sportsDataBasePath}/AllTeams?key=${this.apiKey}`);

    //NBA Players endpoint (https://api.sportsdata.io/v3/nba/scores/json/PlayersActiveBasic)
    this.activePlayersEndpoint = new URL(`${this.sportsDataBasePath}/PlayersActiveBasic?key=${this.apiKey}`);

    // Add other endpoints as needed
  }

  /**
   * Fetches data from the Sportsdata.io API's NBA all teams endpoint
   * @returns A promise resolving to the JSON data returned from Sportsdata.io
   * @throws An error if the fetch request fails or the response is invalid.
   */
  getAllTeams = async (): Promise<SportsDataTeamRO[]> => {
    const response = await fetch(this.allTeamsEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch NBA all teams data from Sportsdata.io  ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json() as SportsDataTeamRO[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to parse JSON response from Sportsdata.io ${this.allTeamsEndpoint}: ${errorMessage}`);
    }
  };

  /**
   * Fetches data from the Sportsdata.io API's NBA active players endpoint
   * @returns A promise resolving to the JSON data returned from Sportsdata.io
   * @throws An error if the fetch request fails or the response is invalid.
   */
  getAllActivePlayers = async (): Promise<SportsDataPlayerRO[]> => {
    const response = await fetch(this.activePlayersEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch NBA all active players data from Sportsdata.io  ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json() as SportsDataPlayerRO[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to parse JSON response from Sportsdata.io ${this.activePlayersEndpoint}: ${errorMessage}`);
    }
  };
};

export { NbaSportsDataDAO };