import MeasurementDefinition from "../../models/Measurement_definition.js";
import { generateMeasurementKey } from "../../utils/measurementKeyGenerator.js";

export const index = async (req, res) => {
  try {
    const measurementDefinitions = await MeasurementDefinition.query().where(
      "is_active",
      1
    );

    if (!measurementDefinitions) {
      return res
        .status(404)
        .json({ message: "No measurement definitions found" });
    }
    res.json(measurementDefinitions);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving measurement definitions.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const measurementDefinition = await MeasurementDefinition.query().findById(
      id
    );

    if (!measurementDefinition) {
      return res
        .status(404)
        .json({ message: "Measurement definition not found." });
    }

    res.json(measurementDefinition);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a measurement definition.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { name, short_name, unit, min_value, max_value } = req.body;
  try {
    const measurement_key = generateMeasurementKey(name);

    const newMeasurementDefinition = await MeasurementDefinition.query().insert(
      {
        name,
        short_name,
        unit,
        min_value,
        max_value,
        measurement_key,
      }
    );

    res.status(201).json({
      message: `Measurement definition created: ${newMeasurementDefinition.name}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a measurement definition.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  const { name, short_name, unit, min_value, max_value, is_active } = req.body;
  try {
    const measurement_key = generateMeasurementKey(name);

    const updatedMeasurementDefinition =
      await MeasurementDefinition.query().patchAndFetchById(id, {
        name,
        short_name,
        unit,
        min_value,
        max_value,
        is_active,
        measurement_key,
      });

    return res.status(200).json({
      message: `Measurement definition: ${updatedMeasurementDefinition.name} was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating measurement definition.",
      error: error.message,
    });
  }
};
