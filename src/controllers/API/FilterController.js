import Filter from "../../models/Filter.js";

export const index = async (req, res) => {
  try {
    const filters = await Filter.query().where("is_active", 1);

    if (!filters) {
      return res.status(404).json({ message: "No filters found" });
    }
    res.json(filters);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving filters.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const filter = await Filter.query().findById(id);

    if (!filter) {
      return res.status(404).json({ message: "Filter not found." });
    }

    res.json(filter);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a filter.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { name, sub_id } = req.body;
  try {
    const newFilter = await Filter.query().insert({
      name,
      sub_id,
    });
    res.status(201).json({ message: `Filter created: ${newFilter.name}` });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a filter.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, sub_id, is_active } = req.body;
  try {
    const updatedFilter = await Filter.query().patchAndFetchById(id, {
      name,
      sub_id,
      is_active,
    });

    return res.status(200).json({
      message: `Filter: ${updatedFilter.name} was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating filter.",
      error: error.message,
    });
  }
};
