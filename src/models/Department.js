import knex from "../lib/Knex.js";
import { Model } from "objection";
import SubDepartment from "./Sub_department.js";

Model.knex(knex);

class Department extends Model {
  static get tableName() {
    return "departments";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        is_active: { type: "integer", minimum: 0, maximum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      sub_departments: {
        relation: Model.HasManyRelation,
        modelClass: SubDepartment,
        join: {
          from: "departments.id",
          to: "sub_departments.department_id",
        },
      },
    };
  }
}

export default Department;
