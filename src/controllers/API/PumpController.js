import Pump from "../../models/Pump.js";

export const index = async (req, res) => {
  try {
    const pumps = await Pump.query().where("is_active", 1);

    if (!pumps) {
      return res.status(404).json({ message: "No pumps found" });
    }
    res.json(pumps);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving pumps.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const pump = await Pump.query().findById(id);

    if (!pump) {
      return res.status(404).json({ message: "Pump not found." });
    }

    res.json(pump);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a pump.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { name, sub_id } = req.body;
  try {
    const newPump = await Pump.query().insert({
      name,
      sub_id,
    });
    res.status(201).json({ message: `Pump created: ${newPump.name}` });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a pump.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, sub_id, is_active } = req.body;
  try {
    const updatedPump = await Pump.query().patchAndFetchById(id, {
      name,
      sub_id,
      is_active,
    });

    return res.status(200).json({
      message: `Pump: ${updatedPump.name} was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating pump.",
      error: error.message,
    });
  }
};
