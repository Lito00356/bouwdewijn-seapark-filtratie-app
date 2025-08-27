const checkFieldUniqueness = (Model, field, isUpdate = false) => {
  return async (value, { req }) => {
    let query = Model.query().whereRaw(`LOWER("${field}") = ?`, [
      value.toLowerCase(),
    ]);

    if (isUpdate) {
      const entityId = req.params.id || req.body.id;
      query = query.whereNot("id", entityId);
    }

    const exists = await query.first();
    if (exists) {
      throw new Error(`This ${field} is already in use.`);
    }
    return true;
  };
};

export default checkFieldUniqueness;
