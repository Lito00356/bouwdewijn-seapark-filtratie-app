import MeasurementDefinition from "../models/Measurement_definition.js";

export const getMeasurementDefinitions = async (isActive = 1) => {
  return await MeasurementDefinition.query().where("is_active", isActive);
};

export const getGroupedDefinitions = async () => {
  const definitions = await getMeasurementDefinitions();

  return  definitions.reduce((groups, definition) => {
    let category = "other";

    if (
      definition.name.toLowerCase().includes("chlorine") ||
      definition.name.toLowerCase().includes("cl")
    ) {
      category = "chlorine";
    } else if (
      definition.name.toLowerCase().includes("ph") ||
      definition.name.toLowerCase().includes("temperature") ||
      definition.name.toLowerCase().includes("salinity")
    ) {
      category = "water_quality";
    } else if (definition.name.toLowerCase().includes("coli")) {
      category = "microbiology";
    }

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(definition);
    return groups;
  }, {});
};
