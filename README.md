# betchya-backend

Supabase project to serve as the backend for Betchya.

## Local setup

- **Prereqs**
  - Deno v2.x (macOS): `brew install deno`
  - (Optional) Supabase CLI: `brew install supabase/tap/supabase`

- **Environment for tests**
  - Create `supabase/functions/.env` with:
    - `SUPABASE_URL=http://localhost:54321`
    - `SUPABASE_ANON_KEY=<your_anon_key_or_dummy_for_tests>`
    - `SPORTS_DATA_NBA_API_KEY=<your_key_or_dummy_for_tests>`

## Run tests

- From `supabase/functions/tests/`:
  - `deno task test`
  - This uses `tests/deno.json` and `tests/import_map.json`.

## CI workflow

- GitHub Actions workflow: `.github/workflows/testing.yml`
  - `unit_tests` job runs the Deno test suite.
  - `deploy_db_migrations` and `deploy_edge_functions` are gated on
    `unit_tests`.

## Notable implementation notes

- Layered architecture (Controller, Service, DAO, Entities, RO, Shared). Main
  function `nba` exposes endpoints like:
  - `POST /nba/teams` – sync NBA teams into Supabase
  - `POST /nba/games` – sync NBA games for a date (expects `YYYY-MM-DD`)
- `NbaController.updateGames()`
  - Accepts only `YYYY-MM-DD` (zero‑padded) and validates real calendar dates
    (incl. leap year handling).

- `SupabaseDbDAO` testability
  - `constructor(schema, client?)` allows injecting a fake `SupabaseClient` in
    unit tests to avoid network/background intervals.

## Logging

- Structured JSON logger at `supabase/functions/shared/Logger.ts`.
- Control verbosity via `LOG_LEVEL` env: `debug`, `info`, `warn`, `error`
  (default `info`).
- CI sets `LOG_LEVEL=warn` to reduce noise.
- Example line:
  ```json
  {
    "ts": "2025-01-01T00:00:00.000Z",
    "level": "warn",
    "msg": "sportsdata non-ok GamesByDate",
    "date": "2025-03-01",
    "status": 429,
    "statusText": "Too Many Requests"
  }
  ```

## Endpoints

- **POST /nba/games**
  - Purpose: Sync games for a single day.
  - Validation: Strict `YYYY-MM-DD` (zero‑padded) and real calendar date.
  - Example:
    ```bash
    curl -X POST http://localhost:54321/functions/v1/nba/games \
      -H "Content-Type: application/json" \
      -d '{"date":"2025-03-01"}'
    ```

- **POST /nba/games/range**
  - Purpose: Sync games for an inclusive date range.
  - Body: `{ "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }`
  - Validation: Strict `YYYY-MM-DD` and real calendar dates;
    `startDate <= endDate`; max 31 days.
  - Example:
    ```bash
    curl -X POST http://localhost:54321/functions/v1/nba/games/range \
      -H "Content-Type: application/json" \
      -d '{"startDate":"2025-03-01","endDate":"2025-03-07"}'
    ```
