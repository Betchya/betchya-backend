import { Context } from "hono";
import { NbaService } from "../service/NbaService.ts";
import { isValidYYYYMMDDDate, normalizeYYYYMMDD } from "../../shared/DateValidation.ts";

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
            const normalized = normalizeYYYYMMDD(body.date);
            if (normalized && !isValidYYYYMMDDDate(normalized)) {
                return context.json({ message: "Invalid date. Expected format: YYYY-MM-DD" }, { status: 400 });
            }
            // Service will default to today's date if no date is provided
            const date = normalized;

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
    
    updateGamesRange = async (context: Context) => {
        try {
            const body = await context.req.json<{ startDate?: string; endDate?: string }>().catch(() => ({}) as { startDate?: string; endDate?: string });
            const rawStart = normalizeYYYYMMDD(body.startDate);
            const rawEnd = normalizeYYYYMMDD(body.endDate);

            if (!rawStart || !rawEnd) {
                return context.json({ message: "Missing required startDate and/or endDate." }, { status: 400 });
            }

            if (!isValidYYYYMMDDDate(rawStart) || !isValidYYYYMMDDDate(rawEnd)) {
                return context.json({ message: "Invalid dates. Expected format: YYYY-MM-DD" }, { status: 400 });
            }

            const start = new Date(`${rawStart}T00:00:00Z`).getTime();
            const end = new Date(`${rawEnd}T00:00:00Z`).getTime();
            if (isNaN(start) || isNaN(end) || start > end) {
                return context.json({ message: "Invalid range. startDate must be less than or equal to endDate." }, { status: 400 });
            }

            // Optional guard: prevent excessively large ranges (e.g., > 31 days)
            const maxDays = 31;
            const days = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
            if (days > maxDays) {
                return context.json({ message: `Range too large. Max ${maxDays} days.` }, { status: 400 });
            }

            const successMessage = await this.nbaService.syncNbaGamesRange(rawStart, rawEnd);
            return context.json({ message: successMessage }, { status: 200 });
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                return context.json({ message: `Failed to update NBA games range: ${error.message}` }, { status: 500 });
            } else {
                return context.json({ message: "Failed to update NBA games range: Unknown error" }, { status: 500 });
            }
        }
    }
};

export { NbaController };