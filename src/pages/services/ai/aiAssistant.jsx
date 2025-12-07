
export async function askAI(question) {
  try {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error("Error fetching AI response:", err);
    return "Sorry, something went wrong!";
  }
}
