import Action from "../models/Action.js";

export const getActions = async (isActive = 1) => {
  return await Action.query().where("is_active", isActive);
};

export const getGroupedActions = async () => {
  const actions = await getActions(1)

  return actions.reduce(
    (acc, action) => {
      if (!acc[action.frequency]) {
        acc[action.frequency] = [];
      }
      acc[action.frequency].push(action);
      return acc;
    },
    {
      daily: [],
      weekly: [],
      monthly: [],
      as_needed: [],
    }
  );
};
