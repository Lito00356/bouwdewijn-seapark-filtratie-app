import { showNotification } from "./ui/notifications.js";

export function validateComment(data) {
  const comment = data.comment || "";
  const commentType = data.commentType || "";
  const userComments = data.userComments;
  
  const hasCommentContent = userComments !== undefined 
    ? userComments.trim() !== ""
    : comment.trim() !== "";
  
  if (hasCommentContent && comment.trim() !== "" && commentType === "") {
    showNotification(
      "Please select a comment type when adding a comment.",
      "error"
    );
    return false;
  }
  
  return true;
}
