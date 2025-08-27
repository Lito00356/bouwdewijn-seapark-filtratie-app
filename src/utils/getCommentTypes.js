import TaskLog from "../models/Task_log.js";

export const getCommentTypes = () => {
  const commentTypeEnums = TaskLog.jsonSchema.properties.comment_type.enum;

  // Add a default "no selection" option at the beginning
  const options = [
    {
      value: "",
      label: "-- Select --",
    },
  ];
  // Add the actual enum values (filter out null)
  const enumOptions = commentTypeEnums
    .filter((type) => type !== null)
    .map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));

  return [...options, ...enumOptions];
};
