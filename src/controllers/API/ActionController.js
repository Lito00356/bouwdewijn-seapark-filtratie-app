import Action from "../../models/Action.js";

export const index = async (req, res) => {
  try {
    const actions = await Action.query().where("is_active", 1);

    if (!actions) {
      return res.status(404).json({ message: "No actions found" });
    }
    res.json(actions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem retrieving actions.", error: error.message });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const action = await Action.query().findById(id);

    if (!action) {
      return res.status(404).json({ message: "Action not found." });
    }

    res.json(action);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem retrieving an action.", error: error.message });
  }
};

export const store = async (req, res) => {
  const { name, object_type, frequency } = req.body;
  try {
    const newAction = await Action.query().insert({
      name,
      object_type,
      frequency,
    });
    res.status(201).json({ message: `Action created: ${newAction.name}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem creating an action.", error: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, object_type, frequency, is_active } = req.body;
  try {
    const updatedAction = await Action.query().patchAndFetchById(id, {
      name,
      object_type,
      frequency,
      is_active,
    });

    return res.status(200).json({
      message: `Action: ${updatedAction.name} was successfully updated`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem updating action.", error: error.message });
  }
};