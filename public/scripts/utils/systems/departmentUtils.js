export function getItemsByDepartment(
  allItems,
  allSubdepartments,
  departmentId
) {
  const departmentSubdepartments = allSubdepartments.filter(
    (subdept) => subdept.department_id === departmentId
  );
  const subdepartmentIds = departmentSubdepartments.map(
    (subdept) => subdept.id
  );

  return allItems.filter((item) => subdepartmentIds.includes(item.sub_id));
}


export function getSubdepartmentsByDepartment(allSubdepartments, departmentId) {
  return allSubdepartments.filter(
    (subdept) => subdept.department_id === departmentId
  );
}
