import { createClient, SupabaseClient } from 'supabase';
import { SupabaseDbRecord } from "../../shared/types.ts";
import * as EnvironmentVariables from "../../shared/EnvironmentVariables.ts";

enum SupabaseSchemaType {
  NBA = 'nba',
};

class SupabaseDbDAO {
  private supabaseClient: SupabaseClient;
  private schema: SupabaseSchemaType;

  constructor(schema: SupabaseSchemaType) {
    // Use anon key to respect RLS by default. If elevated privileges are needed for a specific flow,
    // consider wiring a separate client or making this configurable.
    this.supabaseClient = createClient(
        EnvironmentVariables.SUPABASE_URL!,
        EnvironmentVariables.SUPABASE_ANON_KEY!
    );
    this.schema = schema;
  }

  /**
   * Upserts data into the specified Supabase table.
   * @param upsertData - An array of records of type T to upsert.
   * @returns A promise resolving to the upsert result.
   */
  upsertRecords = async <T extends SupabaseDbRecord> (upsertData: T[], tableName: string, conflictKey: string) => {
    const { data, error } = await this.supabaseClient
        .schema(this.schema)
        .from(tableName)
        .upsert(upsertData, { onConflict: conflictKey });
      
    return { data, error };
  }
}

export { SupabaseDbDAO, SupabaseSchemaType };