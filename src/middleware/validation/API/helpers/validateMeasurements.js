const validateMeasurements = (measurements) => {
  Object.entries(measurements).forEach(([key, value]) => {
    if (value === "") {
      measurements[key] = null;
    }

    const isValid =
      typeof measurements[key] === "number" || measurements[key] === null;

    if (!isValid) {
      throw new Error(`Measurement value should be a number or null`);
    }
  });
  return true;
};

export default validateMeasurements;
