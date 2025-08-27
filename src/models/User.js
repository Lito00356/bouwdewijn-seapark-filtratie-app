import knex from "../lib/Knex.js";
import { Model } from "objection";
import TaskLog from "./Task_log.js";
import MeasurementLog from "./Measurement_log.js";

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstname", "lastname", "email", "pin", "is_admin"],
      properties: {
        id: { type: "integer" },
        firstname: { type: "string", minLength: 1, maxLength: 255 },
        lastname: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        pin: { type: "string", minLength: 1, maxLength: 255 },
        is_admin: { type: "integer" },
        is_active: { type: "integer", minimum: 0, maximum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      task_logs: {
        relation: Model.HasManyRelation,
        modelClass: TaskLog,
        join: {
          from: "users.id",
          to: "task_logs.user_id",
        },
      },

      measurement_logs: {
        relation: Model.HasManyRelation,
        modelClass: MeasurementLog,
        join: {
          from: "users.id",
          to: "measurement_logs.user_id",
        },
      },
    };
  }
}

export default User;
