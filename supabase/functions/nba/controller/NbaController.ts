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

    updateGames = async (context: Context) => {
        try {
            const body = await context.req.json<{ date?: string }>().catch(() => ({} as { date?: string }));
            const rawDate = typeof body.date === 'string' ? body.date.trim() : undefined;
            // If a date is provided, validate format (YYYY-MM-DD) and that it's a valid calendar date
            if (rawDate) {
                const datePattern = /^\d{4}-\d{2}-\d{2}$/;
                const validFormat = datePattern.test(rawDate);
                const validDate = !Number.isNaN(Date.parse(rawDate));
                if (!validFormat || !validDate) {
                    return context.json({ message: "Invalid date. Expected format: YYYY-MM-DD" }, { status: 400 });
                }
            }
            // Service will default to today's date if no date is provided
            const date = rawDate && rawDate.length > 0 ? rawDate : undefined;

            const successMessage = await this.nbaService.syncNbaGameData(date);
            return context.json({ message: successMessage }, { status: 200 });
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                return context.json({ message: `Failed to update NBA games: ${error.message}` }, { status: 500 });
            } else {
                return context.json({ message: "Failed to update NBA games: Unknown error" }, { status: 500 });
            }
        }
    }
};

export { NbaController };