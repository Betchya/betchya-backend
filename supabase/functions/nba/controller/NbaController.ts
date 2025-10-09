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
                let validDate = false;
                if (validFormat) {
                    const [yearStr, monthStr, dayStr] = rawDate.split("-");
                    const year = Number(yearStr);
                    const month = Number(monthStr);
                    const day = Number(dayStr);
                    // Construct a UTC date and compare components to ensure no rollover occurred
                    const dt = new Date(Date.UTC(year, month - 1, day));
                    validDate = dt.getUTCFullYear() === year && (dt.getUTCMonth() + 1) === month && dt.getUTCDate() === day;
                }
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
    
    updateGamesRange = async (context: Context) => {
        try {
            const body = await context.req.json<{ startDate?: string; endDate?: string }>().catch(() => ({}) as { startDate?: string; endDate?: string });
            const rawStart = typeof body.startDate === 'string' ? body.startDate.trim() : undefined;
            const rawEnd = typeof body.endDate === 'string' ? body.endDate.trim() : undefined;

            if (!rawStart || !rawEnd) {
                return context.json({ message: "Missing required startDate and/or endDate." }, { status: 400 });
            }

            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            const validFormatStart = datePattern.test(rawStart);
            const validFormatEnd = datePattern.test(rawEnd);

            const isRealDate = (d: string) => {
                const [y, m, d2] = d.split("-").map((n) => Number(n));
                const dt = new Date(Date.UTC(y, m - 1, d2));
                return dt.getUTCFullYear() === y && (dt.getUTCMonth() + 1) === m && dt.getUTCDate() === d2;
            };

            if (!validFormatStart || !validFormatEnd || !isRealDate(rawStart) || !isRealDate(rawEnd)) {
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