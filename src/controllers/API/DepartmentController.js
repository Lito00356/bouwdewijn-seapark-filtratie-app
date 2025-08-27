import Department from "../../models/Department.js";

export const index = async (req, res) => {
  try {
    const departments = await Department.query().where("is_active", 1);

    if (!departments) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.json(departments);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving departments.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.query().findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a department.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { name } = req.body;
  try {
    const newDepartment = await Department.query().insert({
      name,
    });
    res
      .status(201)
      .json({ message: `Department created: ${newDepartment.name}` });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a department.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, is_active } = req.body;
  try {
    const updatedDepartment = await Department.query().patchAndFetchById(id, {
      name,
      is_active,
    });

    return res.status(200).json({
      message: `Department: ${updatedDepartment.name} was successfully updated`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem updating department.", error: error.message });
  }
};
