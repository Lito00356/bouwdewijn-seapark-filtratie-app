import knex from "../lib/Knex.js";
import { Model } from "objection";

Model.knex(knex);

class Notification extends Model {
  static get tableName() {
    return "notifications";
  }

  static get idColumn() {
    return "id";
  }
  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);

    // Format created_at timestamp - convert UTC to Belgium time properly
    if (json.created_at) {
      // Parse the UTC timestamp
      const utcDate = new Date(json.created_at);

      // Format directly to Belgium timezone string without double conversion
      json.created_at_formatted = utcDate
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

  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json);
    return json;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "message"],
      properties: {
        id: { type: "integer" },
        title: { type: "string" },
        message: { type: "string" },
        comment_type: {
          type: ["string", "null"],
          enum: ["error", "observation", "other", null],
        },
        is_read: { type: "boolean" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}

export default Notification;
