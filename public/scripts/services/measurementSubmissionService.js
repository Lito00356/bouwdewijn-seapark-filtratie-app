import { getCurrentSubDepartmentId } from "../utils/domUtils.js";

export async function submitMeasurementLog(measurementData) {
  const formattedComment = measurementData.comment
    ? measurementData.comment.replace(/\n/g, " | ")
    : null;
  const payload = {
    sub_id: getCurrentSubDepartmentId(),
    measurements: measurementData.measurements,
    comment: formattedComment,
    comment_type: measurementData.commentType || "",
  };

  const response = await fetch("/api/measurement_logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result = await response.json();
  return result;
}
