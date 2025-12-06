// src/pages/services/analytics/runAnalytics.js

import { generateAnalytics } from "../../services/analytics/analyticsEngine";

async function runAnalytics() {
  try {
    const result = await generateAnalytics();
    console.log("✅ Analytics updated successfully!");
    console.log(result);
  } catch (error) {
    console.error("❌ Error updating analytics:", error);
  }
}

runAnalytics();
