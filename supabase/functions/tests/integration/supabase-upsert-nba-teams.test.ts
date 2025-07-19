import { createClient } from "supabase";
import * as EnvironmentVariables from "../../shared/EnvironmentVariables.ts";

// Replace with your local or remote Supabase API URL and service role key as needed
const supabase = createClient(
  EnvironmentVariables.SUPABASE_URL!,
  EnvironmentVariables.SUPABASE_ANON_KEY!
);

// Example upsert data, adjust as needed for your schema
const upsertData = [{
  teamid: 1,
  teamabbreviation: "WAS",
  city: "Washington DC", // Changed to force an update
  teamname: "Wizards",
  conference: "Eastern",
  division: "Southeast",
  active: true,
  recordlastupdated: new Date().toISOString(),
}];

const { error, data } = await supabase
  .from("teams")
  .upsert(upsertData, { onConflict: "teamid" });

console.log("Upsert result:", { error, data });

// Select and print the row to verify the update
const { data: rows, error: selectError } = await supabase
  .from("teams")
  .select("*")
  .eq("teamid", 1);

console.log("Select result:", { selectError, rows });
