import SubDepartment from "../../models/Sub_department.js";

export const index = async (req, res) => {
  try {
    const subDepartments = await SubDepartment.query()
      .where("is_active", 1)
      .select("id", "name", "department_id");

    if (!subDepartments) {
      return res.status(404).json({ message: "No sub-departments found" });
    }
    res.json(subDepartments);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving sub-departments.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const subDepartment = await SubDepartment.query().findById(id);

    if (!subDepartment) {
      return res.status(404).json({ message: "Sub-department not found." });
    }

    res.json(subDepartment);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a sub-department.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { name, department_id } = req.body;
  try {
    const newSubDepartment = await SubDepartment.query().insert({
      name,
      department_id,
    });
    res
      .status(201)
      .json({ message: `Sub-department created: ${newSubDepartment.name}` });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a sub-department.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, department_id, is_active } = req.body;
  try {
    const updatedSubDepartment = await SubDepartment.query().patchAndFetchById(
      id,
      {
        name,
        department_id,
        is_active,
      }
    );

    return res.status(200).json({
      message: `Sub-department: ${updatedSubDepartment.name} was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating sub-department.",
      error: error.message,
    });
  }
};
