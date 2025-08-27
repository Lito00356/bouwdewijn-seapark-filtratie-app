import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";
import Action from "./Action.js";

Model.knex(knex);

class TaskLog extends Model {
  static get tableName() {
    return "task_logs";
  }
  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);

    if (json.performed_at) {
      const date = new Date(json.performed_at);
      json.performed_at = date
        .toLocaleString("nl-BE", {
          timeZone: "Europe/Brussels",
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(", ", " ");
    }

    return json;
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "action_id", "object_type", "object_name"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        action_id: { type: "integer" },
        object_type: {
          type: "string",
          enum: ["filter", "pump", "department", "sub_department"],
        },
        object_name: { type: "string", minLength: 1, maxLength: 255 },
        comment_type: {
          type: ["string", "null"],
          enum: ["error", "observation", "other", null],
        },
        comment: { type: ["string", "null"] },
        performed_at: { type: "string" },
        is_complete: { type: "integer", minimum: 0, maximum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "task_logs.user_id",
          to: "users.id",
        },
      },
      actions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Action,
        join: {
          from: "task_logs.action_id",
          to: "actions.id",
        },
      },
    };
  }
}

export default TaskLog;
