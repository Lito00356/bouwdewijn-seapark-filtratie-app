const checkEntityExists =
  (Model, entityName = "Entity") =>
  async (id) => {
    const exists = await Model.query().findById(id);
    if (!exists) {
      throw new Error(`${entityName} not found.`);
    }
    return true;
  };
export default checkEntityExists;
