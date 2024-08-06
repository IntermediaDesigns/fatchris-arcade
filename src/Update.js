import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (same as in App.js)
const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
const supabaseKey = "YOUR_SUPABASE_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

function Update() {
  const [status, setStatus] = useState("");

  const updateStatus = async () => {
    // First, authenticate
    const { error: signInError } = await supabase.auth.signIn({
      email: "your-email@example.com",
      password: "your-password",
    });

    if (signInError) {
      alert("Authentication failed: " + signInError.message);
      return;
    }

    // Then, update status
    const { error: updateError } = await supabase
      .from("status")
      .update({ value: status })
      .eq("id", 1); // Assuming you have a single row with id 1

    if (updateError) {
      alert("Error updating status: " + updateError.message);
    } else {
      alert("Status updated successfully");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="Enter Yes or No"
      />
      <button onClick={updateStatus}>Update Status</button>
    </div>
  );
}

export default Update;
