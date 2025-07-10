import { createClient } from "supabase";

// Replace with your local or remote Supabase API URL and service role key as needed
const supabase = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
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
