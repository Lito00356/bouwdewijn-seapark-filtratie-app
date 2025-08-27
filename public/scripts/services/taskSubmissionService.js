export async function submitTaskLogs(taskLogs) {
  const response = await fetch("/api/task_logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskLogs),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ API Error Response:", errorData);
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result = await response.json();
  return result;
}
