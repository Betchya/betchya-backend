import { SportsDataTeamRO } from "../ro/SportsDataTeamRO.ts"; // Import the type for SportsData.io NBA Team response
import { SportsDataGameRO } from "../ro/SportsDataGameRO.ts"; // Import the type for SportsData.io NBA Game response
import * as EnvironmentVariables from "../../shared/EnvironmentVariables.ts"; // Import environment variables
import { Logger } from "../../shared/Logger.ts";

class NbaSportsDataDAO {
  private apiKey: string;
  private sportsDataDomain: string = "https://api.sportsdata.io";
  private readonly allTeamsEndpoint: URL;

  constructor() {
    //TODO Is this just for NBA data, or is it a single client API Key for all SportsData.io data?
    this.apiKey = EnvironmentVariables.SPORTS_DATA_API_KEY!;

    // NBA All Teams endpoint
    this.allTeamsEndpoint = new URL(`${this.sportsDataDomain}/v3/nba/scores/json/AllTeams?key=${this.apiKey}`);
    // Add other endpoints as needed
  }

  /**
   * Fetches data from the Sportsdata.io API's NBA all teams endpoint
   * @returns A promise resolving to the JSON data returned from Sportsdata.io
   * @throws An error if the fetch request fails or the response is invalid.
   */
  getAllTeams = async (): Promise<SportsDataTeamRO[]> => {
    Logger.debug("sportsdata fetch AllTeams", { url: this.allTeamsEndpoint.toString() });
    const response = await fetch(this.allTeamsEndpoint);
    if (!response.ok) {
      Logger.warn("sportsdata non-ok AllTeams", { status: response.status, statusText: response.statusText });
      throw new Error(`Failed to fetch NBA all teams data from Sportsdata.io  ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json() as SportsDataTeamRO[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      Logger.error("sportsdata json parse error AllTeams", { url: this.allTeamsEndpoint.toString(), error: errorMessage });
      throw new Error(`Failed to parse JSON response from Sportsdata.io ${this.allTeamsEndpoint}: ${errorMessage}`);
    }
  };

  /**
   * Fetches NBA games for a specific date from Sportsdata.io API's GamesByDate endpoint
   * Date format: YYYY-MM-DD (Sportsdata.io expects this format)
   * @returns A promise resolving to the JSON data returned from Sportsdata.io
   * @throws An error if the fetch request fails or the response is invalid.
   */
  getGamesByDate = async (date: string): Promise<SportsDataGameRO[]> => {
    // Basic validation for YYYY-MM-DD
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      throw new Error(`Invalid date format. Expected YYYY-MM-DD, received: ${date}`);
    }

    const endpoint = new URL(`${this.sportsDataDomain}/v3/nba/scores/json/GamesByDate/${date}?key=${this.apiKey}`);
    Logger.debug("sportsdata fetch GamesByDate", { date, url: endpoint.toString() });
    const response = await fetch(endpoint);
    if (!response.ok) {
      Logger.warn("sportsdata non-ok GamesByDate", { date, status: response.status, statusText: response.statusText });
      throw new Error(`Failed to fetch NBA games for ${date} from Sportsdata.io ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json() as SportsDataGameRO[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      Logger.error("sportsdata json parse error GamesByDate", { date, url: endpoint.toString(), error: errorMessage });
      throw new Error(`Failed to parse JSON response from Sportsdata.io ${endpoint}: ${errorMessage}`);
    }
  }
};

export { NbaSportsDataDAO };