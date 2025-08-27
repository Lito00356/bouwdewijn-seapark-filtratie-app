import { frequencyLabels, frequencyOrder } from "../../constants/frequencyConstants.js";
import { employeeNavigationData, employeeNavItemActive, getCleanCurrentUrl, getCurrentSection } from "../../constants/navigationConstants.js";
import { getGroupedActions } from "../../queries/actionQueries.js";
import { getDepartmentsWithFullHierarchy, getDepartments, extractFlatArrays } from "../../queries/departmentQueries.js";
import { getMeasurementDefinitions } from "../../queries/measurementQueries.js";
import { getCommentTypes } from "../../utils/getCommentTypes.js";
import { getUnreadCount } from "../../middleware/validation/API/helpers/NotificationService.js";

export const renderEmployeePage = async (req, res) => {
  try {
    const [measurementDefinitions, allDepartments, departmentsWithHierarchy] = await Promise.all([getMeasurementDefinitions(), getDepartments(), getDepartmentsWithFullHierarchy()]);

    if (!allDepartments.length) {
      return res.status(404).json({
        error: "No departments found",
      });
    }

    // Always use first department for initial load
    const selectedDepartmentId = allDepartments[0].id;
    const selectedDepartment = departmentsWithHierarchy.find((dept) => dept.id === selectedDepartmentId);

    if (!selectedDepartment) {
      return res.status(404).json({
        error: "Department not found",
      });
    }
    const departmentSubdepartments = selectedDepartment.sub_departments || [];
    const defaultSubDepartmentId = departmentSubdepartments[0]?.id;

    const { allFilters: departmentFilters, allPumps: departmentPumps } = extractFlatArrays([selectedDepartment]); // Group actions by frequency
    const groupedActions = await getGroupedActions();
    const commentTypes = getCommentTypes();

    // Get unread notification count
    const unreadNotificationCount = await getUnreadCount();

    // Navigation helper functions
    const cleanCurrentUrl = getCleanCurrentUrl(req);
    const section = getCurrentSection(cleanCurrentUrl);
    const isNavItemActive = employeeNavItemActive(req);

    res.render("pages/employee-page", {
      employeeNavigationData,
      groupedActions,
      measurementDefinitions,
      selectedDepartment,
      departments: allDepartments,
      subdepartments: departmentSubdepartments, // initial subdepartments for first department
      filters: departmentFilters,
      pumps: departmentPumps,
      selectedDepartmentId,
      defaultSubDepartmentId,
      commentTypes,
      frequencyLabels,
      frequencyOrder,
      cleanCurrentUrl,
      section,
      isNavItemActive,
      unreadNotificationCount,
    });
  } catch (error) {
    console.error("Error rendering employee page:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
