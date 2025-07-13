import { Context } from "hono";
import { NbaService } from "../service/NbaService.ts";

class NbaController {
    
    private nbaService: NbaService;

    constructor(nbaService: NbaService) {
        this.nbaService = nbaService;
    }

    updateTeams = async (context: Context) => {
        try {
            const successMessage = await this.nbaService.syncNbaTeamData();
            return context.json({ message: successMessage }, { status: 200 });
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                return context.json({ message: `Failed to update NBA teams: ${error.message}` }, { status: 500 });
            } else {
                return context.json({ message: "Failed to update NBA teams: Unknown error" }, { status: 500 });
            }
        }
    }
};

export { NbaController };