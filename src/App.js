import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
const supabaseKey = "YOUR_SUPABASE_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Fetch initial status
    fetchStatus();

    // Set up real-time subscription
    const statusSubscription = supabase
      .from("status")
      .on("*", (payload) => {
        setStatus(payload.new.value);
      })
      .subscribe();

    // Update date
    setDate(new Date().toLocaleDateString());

    // Cleanup subscription
    return () => {
      supabase.removeSubscription(statusSubscription);
    };
  }, []);

  const fetchStatus = async () => {
    const { data, error } = await supabase
      .from("status")
      .select("value")
      .single();

    if (error) console.error("Error fetching status:", error);
    else setStatus(data.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{date}</h1>
      <h2>{status}</h2>
    </div>
  );
}

export default App;
