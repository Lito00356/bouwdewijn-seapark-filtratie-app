import knex from "../lib/Knex.js";
import { Model } from "objection";
import TaskLog from "./Task_log.js";

Model.knex(knex);

class Action extends Model {
  static get tableName() {
    return "actions";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "object_type", "frequency"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        object_type: {
          type: "string",
          enum: ["filter", "pump", "department", "sub_department"],
        },
        frequency: {
          type: "string",
          enum: ["daily", "weekly", "monthly", "as_needed"],
        },
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
          from: "actions.id",
          to: "task_logs.action_id",
        },
      },
    };
  }
}

export default Action;
