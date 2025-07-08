import { createClient, SupabaseClient } from 'supabase';
import { SupabaseDbRecord } from "../../shared/types.ts";

enum SupabaseSchemaType {
  NBA = 'nba',
};

class SupabaseDbNbaDao {
  private supabaseClient: SupabaseClient;
  private schema: SupabaseSchemaType;

  constructor(schema: SupabaseSchemaType) {
    this.supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!
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

export { SupabaseDbNbaDao, SupabaseSchemaType };