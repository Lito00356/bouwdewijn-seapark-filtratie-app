import Department from "../models/Department.js";
import SubDepartment from "../models/Sub_department.js";
import Filter from "../models/Filter.js";
import Pump from "../models/Pump.js";

export const getDepartments = async (isActive = 1) => {
  return await Department.query().where("is_active", isActive);
};

export const getDepartmentsWithSubs = async () => {
  return await Department.query()
    .where("is_active", 1)
    .withGraphFetched("sub_departments")
    .modifyGraph("sub_departments", (builder) => {
      builder.where("is_active", 1);
    });
};

export const getDepartmentsWithFullHierarchy = async () => {
  return await Department.query()
    .where("is_active", 1)
    .withGraphFetched("[sub_departments.[filters, pumps]]")
    .modifyGraph("sub_departments", (builder) => {
      builder.where("is_active", 1);
    })
    .modifyGraph("sub_departments.filters", (builder) => {
      builder.where("is_active", 1);
    })
    .modifyGraph("sub_departments.pumps", (builder) => {
      builder.where("is_active", 1);
    });
};

export const getAllFlatEntities = async () => {
  const [departments, subdepartments, filters, pumps] = await Promise.all([
    Department.query().where("is_active", 1),
    SubDepartment.query().where("is_active", 1),
    Filter.query().where("is_active", 1),
    Pump.query().where("is_active", 1),
  ]);

  return { departments, subdepartments, filters, pumps };
};

// HELPER FUNCTIONS
export const extractFlatArrays = (departments) => {
  const allSubdepartments = departments.flatMap((d) => d.sub_departments || []);
  const allFilters = allSubdepartments.flatMap((sd) => sd.filters || []);
  const allPumps = allSubdepartments.flatMap((sd) => sd.pumps || []);

  return { allSubdepartments, allFilters, allPumps };
};

export const getDepartmentSpecificData = (
  departments,
  selectedDepartmentId
) => {
  const selectedDepartment = departments.find(
    (d) => d.id === selectedDepartmentId
  );

  if (!selectedDepartment) {
    return {
      selectedDepartment: null,
      departmentSubdepartments: [],
      departmentFilters: [],
      departmentPumps: [],
    };
  }

  const departmentSubdepartments = selectedDepartment.sub_departments || [];
  const departmentFilters = departmentSubdepartments.flatMap(
    (sd) => sd.filters || []
  );
  const departmentPumps = departmentSubdepartments.flatMap(
    (sd) => sd.pumps || []
  );

  return {
    selectedDepartment,
    departmentSubdepartments,
    departmentFilters,
    departmentPumps,
  };
};

export const getSelectedIds = (req, departments) => {
  const selectedDepartmentId = req.query.department
    ? parseInt(req.query.department, 10)
    : departments[0]?.id || null;

  const selectedDepartment = departments.find(
    (d) => d.id === selectedDepartmentId
  );

  const selectedSubDepartmentId = req.query.subdepartment
    ? parseInt(req.query.subdepartment, 10)
    : selectedDepartment?.sub_departments[0]?.id || null;

  return {
    selectedDepartmentId,
    selectedSubDepartmentId,
    selectedDepartment,
  };
};

export const getDepartmentDetailWithSubs = async (id, isActive = 1) => {
  return await Department.query()
    .findById(id)
    .where("is_active", 1)
    .withGraphFetched("sub_departments")
    .modifyGraph("sub_departments", (builder) => {
      builder.where("is_active", isActive);
    });
};
