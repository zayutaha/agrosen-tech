import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ThingSpeak credentials from environment
    const READ_API_KEY = "LHRD08XC1PTVOSV4";
    const CHANNEL_ID = "724299";
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

    console.log("Fetching data from ThingSpeak...");
    const response = await fetch(url);
    const data = await response.json();

    if (!data.feeds || data.feeds.length === 0) {
      throw new Error("No data received from ThingSpeak");
    }

    const feed = data.feeds[0];
    const nitrogen = parseInt(feed.field1);
    const phosphorus = parseInt(feed.field2);
    const potassium = parseInt(feed.field3);
    const moisture = parseInt(feed.field4);

    console.log(
      `N=${nitrogen}, P=${phosphorus}, K=${potassium}, Moisture=${moisture}`,
    );

    // Insert sensor reading
    const { error: sensorError } = await supabase
      .from("sensor_readings")
      .insert({
        nitrogen,
        phosphorus,
        potassium,
        moisture,
        temperature: 25.5, // Mock data - ThingSpeak doesn't provide this
        humidity: 65.0, // Mock data
      });

    if (sensorError) throw sensorError;

    // Generate alerts based on sensor data
    const alerts = [];

    if (moisture < 500) {
      alerts.push({
        type: "irrigation",
        message: "Moisture LOW → Turn ON irrigation",
        severity: "critical",
      });
    }

    if (nitrogen < 20) {
      alerts.push({
        type: "npk",
        message: "Nitrogen LOW → Add Urea",
        severity: "warning",
      });
    }

    if (phosphorus < 10) {
      alerts.push({
        type: "npk",
        message: "Phosphorus LOW → Add DAP",
        severity: "warning",
      });
    }

    if (potassium < 10) {
      alerts.push({
        type: "npk",
        message: "Potassium LOW → Add Potash",
        severity: "warning",
      });
    }

    if (nitrogen > 200 || phosphorus > 200 || potassium > 200) {
      alerts.push({
        type: "npk",
        message: "NPK VERY HIGH → Stop fertilizing",
        severity: "critical",
      });
    }

    // Insert alerts
    if (alerts.length > 0) {
      const { error: alertError } = await supabase
        .from("alerts")
        .insert(alerts);
      if (alertError) console.error("Alert insert error:", alertError);
    }

    // Calculate health score
    let score = 100;
    if (moisture < 500) score -= 30;
    if (nitrogen < 20) score -= 15;
    if (phosphorus < 10) score -= 15;
    if (potassium < 10) score -= 15;
    if (nitrogen > 200 || phosphorus > 200 || potassium > 200) score -= 25;

    const { error: healthError } = await supabase.from("health_scores").insert({
      score: Math.max(0, score),
      factors: {
        moisture: moisture < 500 ? "low" : "ok",
        nitrogen: nitrogen < 20 ? "low" : nitrogen > 200 ? "high" : "ok",
        phosphorus: phosphorus < 10 ? "low" : phosphorus > 200 ? "high" : "ok",
        potassium: potassium < 10 ? "low" : potassium > 200 ? "high" : "ok",
      },
    });

    if (healthError) console.error("Health score error:", healthError);

    return new Response(
      JSON.stringify({
        success: true,
        data: { nitrogen, phosphorus, potassium, moisture },
        alerts: alerts.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
