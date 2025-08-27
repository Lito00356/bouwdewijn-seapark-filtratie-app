import knex from "../lib/Knex.js";
import { Model } from "objection";
import User from "./User.js";
import SubDepartment from "./Sub_department.js";

Model.knex(knex);

class MeasurementLog extends Model {
  static get tableName() {
    return "measurement_logs";
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    if (json.measurements && typeof json.measurements === "string") {
      json.measurements = JSON.parse(json.measurements);
    }

    if (json.measured_at) {
      const date = new Date(json.measured_at);
      json.measured_at = date.toLocaleString("nl-BE", {
        timeZone: "Europe/Brussels",
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(', ', ' ');
    }

    return json;
  }

  // The "json" param contains one row from the database table and the function
  // executes the logic for each row in the table (parsing the measurements string)

  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json);
    if (json.measurements && typeof json.measurements === "object") {
      json.measurements = JSON.stringify(json.measurements);
    }
    return json;
  }
  // <= Does the same as above but for when the row gets inserted. Could add this
  // inside the controller for the destructured value of measurements as well.

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "sub_id", "measurements"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        sub_id: { type: "integer" },
        measurements: { oneOf: [{ type: "string" }, { type: "object" }] },
        comment: { type: ["string", "null"] },
        comment_type: {
          type: ["string", "null"],
          enum: ["error", "observation", "other", null],
        },
        measured_at: { type: "string" }
      },
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "measurement_logs.user_id",
          to: "users.id",
        },
      },
      sub_departments: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubDepartment,
        join: {
          from: "measurement_logs.sub_id",
          to: "sub_departments.id",
        },
      },
    };
  }
}

export default MeasurementLog;
