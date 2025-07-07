import { createClient, SupabaseClient } from 'supabase';
import { SupabaseDbRecord } from "../../shared/types.ts";

class SupabaseDbNbaDao {
  private supabase: SupabaseClient;
  private schema: string = 'nba';

  constructor() {
    this.supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!
    );
  }

  /**
   * Upserts data into the specified Supabase table.
   * @param upsertData - An array of records of type T to upsert.
   * @returns A promise resolving to the upsert result.
   */
  upsertRecords = async <T extends SupabaseDbRecord> (upsertData: T[], tableName: string, conflictKey: string) => {
    // Debug logging for upsert
    console.log(`${Deno.env.get('SUPABASE_ANON_KEY')}`);
    console.log('Upsert payload sample:', JSON.stringify(upsertData[0], null, 2));
    console.log('Upsert payload length:', upsertData.length);
   
    const { data, error } = await this.supabase
        .schema(this.schema)
        .from(tableName)
        .upsert(upsertData, { onConflict: conflictKey });

    if (error) {
      console.error('Error during upsert:', error);
    } else {
      console.log('Upsert successful:', data);
    }

    return { data, error };
  }
}

export { SupabaseDbNbaDao };