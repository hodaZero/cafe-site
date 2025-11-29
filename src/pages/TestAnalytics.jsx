import React, { useEffect, useState } from "react";
import { generateAnalytics } from "./services/analytics/analyticsEngine";

export default function TestAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await generateAnalytics();
      setData(result);
      console.log("Analytics Test:", result);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Analytics Test Output</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
