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
  - `deploy_db_migrations` and `deploy_edge_functions` are gated on `unit_tests`.

## Notable implementation notes

- Layered architecture (Controller, Service, DAO, Entities, RO, Shared). Main function `nba` exposes endpoints like:
  - `POST /nba/teams` – sync NBA teams into Supabase
  - `POST /nba/games` – sync NBA games for a date (expects `YYYY-MM-DD`)

- `NbaController.updateGames()`
  - Accepts only `YYYY-MM-DD` (zero‑padded) and validates real calendar dates (incl. leap year handling).

- `SupabaseDbDAO` testability
  - `constructor(schema, client?)` allows injecting a fake `SupabaseClient` in unit tests to avoid network/background intervals.
