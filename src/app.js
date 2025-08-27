import express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

// API routes
import actionRoutes from "./routes/API/actions.js";
import departmentRoutes from "./routes/API/departments.js";
import filterRoutes from "./routes/API/filters.js";
import measurementDefinitionRoutes from "./routes/API/measurementDefinitions.js";
import measurementLogRoutes from "./routes/API/measurementLogs.js";
import notificationRoutes from "./routes/API/notifications.js";
import pumpRoutes from "./routes/API/pumps.js";
import subDepartmentRoutes from "./routes/API/subDepartments.js";
import taskLogRoutes from "./routes/API/taskLogs.js";
import userRoutes from "./routes/API/users.js";

// Web routes
import employeeRoutes from "./routes/Web/employeePageRoutes.js";
import loginRoutes from "./routes/Web/loginPageRoutes.js";
import logoutRoutes from "./routes/Web/logoutRoutes.js";
import { departments, departmentDetail, actions, values, statistics, history, calendar, crew } from "./controllers/Web/AdminPageController.js";

import setCurrentUrl from "./middleware/setCurrentUrl.js";
import requireAuth from "./middleware/requireAuth.js";
import requireAdmin from "./middleware/requireAdmin.js";

// Start notification cleanup job
import "./jobs/notificationCleanup.js";

// Start incomplete task posting job
import "./jobs/incompleteTaskPosting.js";

const port = 2000;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", path.resolve("src", "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser());
app.use(setCurrentUrl);

app.use("/login", loginRoutes);

app.use(requireAuth);
app.use("/logout", logoutRoutes);
app.use("/employee", employeeRoutes);

app.use("/api/actions", actionRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/measurement_definitions", measurementDefinitionRoutes);
app.use("/api/measurement_logs", measurementLogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pumps", pumpRoutes);
app.use("/api/sub_departments", subDepartmentRoutes);
app.use("/api/task_logs", taskLogRoutes);
app.use("/api/users", userRoutes);

app.use(requireAdmin);
app.get("/", (req, res) => res.redirect("/departments"));
app.get("/departments", departments);
app.get("/departments/:id", departmentDetail);
app.get("/actions", actions);
app.get("/values", values);
app.get("/statistics", statistics);
app.get("/history", history);
app.get("/calendar", calendar);
app.get("/crew", crew);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
