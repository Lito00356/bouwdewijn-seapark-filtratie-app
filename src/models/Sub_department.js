import knex from "../lib/Knex.js";
import { Model } from "objection";
import Department from "./Department.js";
import Filter from "./Filter.js";
import Pump from "./Pump.js";
import MeasurementLog from "./Measurement_log.js";

Model.knex(knex);

class SubDepartment extends Model {
  static get tableName() {
    return "sub_departments";
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
        department_id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        is_active: { type: "integer", minimum: 0, maximum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: "sub_departments.department_id",
          to: "departments.id",
        },
      },

      filters: {
        relation: Model.HasManyRelation,
        modelClass: Filter,
        join: {
          from: "sub_departments.id",
          to: "filters.sub_id",
        },
      },

      pumps: {
        relation: Model.HasManyRelation,
        modelClass: Pump,
        join: {
          from: "sub_departments.id",
          to: "pumps.sub_id",
        },
      },

      measurement_logs: {
        relation: Model.HasManyRelation,
        modelClass: MeasurementLog,
        join: {
          from: "sub_departments.id",
          to: "measurement_logs.sub_id",
        },
      },
    };
  }
}

export default SubDepartment;
