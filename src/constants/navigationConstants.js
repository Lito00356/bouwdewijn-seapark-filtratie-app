export const adminNavigationData = [
  {
    href: "/departments",
    icon: "department-icon",
    title: "Departments",
    ariaLabel: "Go to Departments",
  },
  {
    href: "/actions",
    icon: "task-icon",
    title: "Tasks",
    ariaLabel: "Go to tasks",
  },
  {
    href: "/values",
    icon: "settings-icon",
    title: "Reference Values",
    ariaLabel: "Go to Ranges",
  },
  {
    href: "/statistics",
    icon: "chart-icon",
    title: "Statistics",
    ariaLabel: "Go to Statistics",
  },
  {
    href: "/history",
    icon: "history-icon",
    title: "History",
    ariaLabel: "Go to History",
  },
  {
    href: "/crew",
    icon: "crew-icon",
    title: "Crew",
    ariaLabel: "Go to Crew",
  },
];

export const employeeNavigationData = {
  dashboards: [
    {
      href: "/employee",
      icon: "home-icon",
      title: "Home",
      ariaLabel: "Go to Home",
      showInNav: true,
      showInDashboard: false,
    },
    {
      href: "/employee/tasks",
      icon: "list-icon",
      title: "Tasks",
      ariaLabel: "Go to Tasks",
      showInNav: true,
      showInDashboard: true,
    },
    {
      href: "/employee/measurements",
      icon: "measurements-icon",
      title: "Measurements",
      ariaLabel: "Go to Measurements",
      showInNav: true,
      showInDashboard: true,
    },
    {
      href: "/employee/notifications",
      icon: "notifications-icon",
      title: "Notifications",
      ariaLabel: "Go to Notifications",
      showInNav: false,
      showInDashboard: false,
    },
  ],
};

// HELPER FUNCTIONS:

export const adminNavItemActive = (req) => {
  return (itemHref) => {
    return req.path.startsWith(itemHref);
  };
};

export const employeeNavItemActive = (req) => {
  const cleanCurrentUrl = getCleanCurrentUrl(req);

  return (itemHref) => {
    const expectedPath = itemHref.replace("/employee", "");
    return cleanCurrentUrl === expectedPath;
  };
};

export const getCleanCurrentUrl = (req) => {
  return req.path.replace(/\/$/, "");
};

export const getCurrentSection = (url) => {
  if (url === "" || url === "/") {
    return "dashboard";
  }
  const pathSegments = url.split("/");
  const lastSegment = pathSegments.pop();
  return lastSegment || "dashboard";
};
