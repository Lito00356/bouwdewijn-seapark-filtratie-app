import Department from "../../../../models/Department.js";
import SubDepartment from "../../../../models/Sub_department.js";
import Filter from "../../../../models/Filter.js";
import Pump from "../../../../models/Pump.js";

export default async function checkObjectNameExists(value, { req, path }) {
  let objectType;

  const match = path.match(/\d+/);
  if (match) {
    const index = Number(match[0]);
    objectType = req.body[index]?.object_type;
  } else {
    objectType = req.body.object_type;
  }

  const models = {
    department: Department,
    sub_department: SubDepartment,
    filter: Filter,
    pump: Pump,
  };

  const Model = models[objectType];

  if (!Model) {
    throw new Error("Invalid object type.");
  }

  const exists = await Model.query().findOne({ name: value, is_active: 1 });
  if (!exists) {
    throw new Error(`No ${objectType} found with name "${value}".`);
  }
  return true;
}
