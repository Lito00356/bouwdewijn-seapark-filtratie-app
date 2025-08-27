import { adminNavigationData, adminNavItemActive } from "../../constants/navigationConstants.js";
import { getDepartments, getDepartmentDetailWithSubs, getDepartmentsWithSubs, getDepartmentsWithFullHierarchy } from "../../queries/departmentQueries.js";
import { getActions, getGroupedActions } from "../../queries/actionQueries.js";
import { getGroupedDefinitions, getMeasurementDefinitions } from "../../queries/measurementQueries.js";

export const departments = async (req, res) => {
  const breadcrumbs = [{ label: "Dashboards" }, { label: "Departments", href: "/departments" }];

  const departments = await getDepartments();
  const inactiveDepartments = await getDepartments(0);

  res.render("pages/departments", {
    breadcrumbs,
    navigationData: adminNavigationData,
    isNavItemActive: adminNavItemActive(req),
    departments,
    inactiveDepartments,
  });
};

export const departmentDetail = async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);
    const department = await getDepartmentDetailWithSubs(departmentId);
    const inActiveSubdepartments = await getDepartmentDetailWithSubs(departmentId, 0);

    if (!department) {
      return res.status(404).render("error", {
        message: "Department not found",
      });
    }

    const breadcrumbs = [{ label: "Dashboards" }, { label: "Departments", href: "/departments" }, { label: department.name, href: `/departments/${department.id}` }];

    res.render("pages/departmentDetail", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
      department,
      inActiveSubdepartments,
    });
  } catch (error) {
    console.error("Error rendering department detail page:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const actions = async (req, res) => {
  const breadcrumbs = [{ label: "Dashboards" }, { label: "Tasks", href: "/actions" }];

  try {
    const groupedActions = await getGroupedActions();
    const inactiveActions = await getActions(0);

    res.render("pages/actions", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
      groupedActions,
      inactiveActions,
    });
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const values = async (req, res) => {
  const breadcrumbs = [{ label: "Dashboards" }, { label: "Reference Values", href: "/values" }];

  try {
    const inactiveMeasurements = await getMeasurementDefinitions(0);
    const groupedMeasurements = await getGroupedDefinitions();

    res.render("pages/values", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
      inactiveMeasurements,
      groupedMeasurements,
    });
  } catch (error) {
    console.error("Error fetching measurement definitions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const statistics = async (req, res) => {
  try {
    const breadcrumbs = [{ label: "Dashboards" }, { label: "Statistics", href: "/statistics" }];
    const departments = await getDepartmentsWithSubs();
    const measurementDefinitions = await getMeasurementDefinitions();

    res.render("pages/statistics", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
      departments,
      measurementDefinitions,
    });
  } catch (error) {
    console.error("Error rendering statistics page", error);
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const history = async (req, res) => {
  try {
    const breadcrumbs = [{ label: "Dashboards" }, { label: "History", href: "/history" }];
    const [allDepartments, departmentsWithHierarchy] = await Promise.all([getDepartments(), getDepartmentsWithFullHierarchy()]);

    const frequencyLabels = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      as_needed: "Extra",
    };

    if (!departments.length) {
      return res.status(404).render("error", {
        message: "No departments foun",
      });
    }

    const selectedDepartmentId = allDepartments[0].id;
    const selectedDepartment = departmentsWithHierarchy.find((dept) => dept.id === selectedDepartmentId);

    if (!selectedDepartment) {
      return res.status(404).json({
        error: "Department not found",
      });
    }
    const departmentSubdepartments = selectedDepartment.sub_departments || [];
    const defaultSubDepartmentId = departmentSubdepartments[0]?.id;

    res.render("pages/history", {
      breadcrumbs,
      frequencyLabels,
      departments: allDepartments,
      selectedDepartmentId,
      defaultSubDepartmentId,
      subdepartments: departmentSubdepartments,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
    });
  } catch (error) {
    console.error("Error rendering histroy page", error);
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const calendar = (req, res) => {
  try {
    const breadcrumbs = [{ label: "Dashboards" }, { label: "Calendar", href: "/calendar" }];

    res.render("pages/calendar", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
    });
  } catch (error) {
    console.error("Error rendering histroy page", error);
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const crew = (req, res) => {
  try {
    const breadcrumbs = [{ label: "Dashboards" }, { label: "Crew", href: "/crew" }];

    res.render("pages/crew", {
      breadcrumbs,
      navigationData: adminNavigationData,
      isNavItemActive: adminNavItemActive(req),
    });
  } catch (error) {
    console.error("Error rendering histroy page", error);
    res.status(500).json({ message: "Internal server error" + error });
  }
};
