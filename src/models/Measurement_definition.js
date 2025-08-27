import knex from "../lib/Knex.js";
import { Model } from "objection";

Model.knex(knex);

class MeasurementDefinition extends Model {
  static get tableName() {
    return "measurement_definitions";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "short_name", "unit"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        short_name: { type: "string", minLength: 1, maxLength: 255 },
        unit: { type: "string", minLength: 1, maxLength: 255 },
        min_value: { type: ["number", "null"] },
        max_value: { type: ["number", "null"] },
        measurement_key: { type: ["string", "null"], minLength: 1, maxLength: 255 },
        is_active: { type: "integer", minimum: 0, maximum: 1 },
      },
    };
  }
}

export default MeasurementDefinition;
