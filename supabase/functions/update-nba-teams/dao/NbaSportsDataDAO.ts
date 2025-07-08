import { SportsDataTeamRO } from "../ro/SportsDataTeamRO.ts"; // Import the type for SportsData.io NBA Team response
import * as EnvironmentVariables from "../../shared/EnvironmentVariables.ts"; // Import environment variables

class NbaSportsDataDAO {
  private apiKey: string;
  private sportsDataDomain: string = "https://api.sportsdata.io";
  private allTeamsEndpoint: URL;

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
};

export { NbaSportsDataDAO };