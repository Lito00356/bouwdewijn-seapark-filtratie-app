import TaskLog from "../../models/Task_log.js";
import SubDepartment from "../../models/Sub_department.js";
import Filter from "../../models/Filter.js";
import Pump from "../../models/Pump.js";
import Department from "../../models/Department.js";
import Action from "../../models/Action.js";
import { createTaskCommentNotification } from "../../middleware/validation/API/helpers/NotificationService.js";

export const index = async (req, res) => {
  try {
    const taskLogs = await TaskLog.query();

    if (!taskLogs) {
      return res.status(404).json({ message: "No task logs found" });
    }
    res.json(taskLogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem retrieving task logs.", error: error.message });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const taskLog = await TaskLog.query().findById(id);

    if (!taskLog) {
      return res.status(404).json({ message: "Task log not found." });
    }
    res.json(taskLog);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a task log.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  try {
    const logs = req.body;
    const logsWithUserId = logs.map((log) => ({
      ...log,
      user_id: req.session.userId,
      is_complete: log.is_complete,
      comment_type: log.comment_type
    }));

    const results = await Promise.allSettled(
      logsWithUserId.map(async (log) => {
        const taskLog = await TaskLog.query().insert(log); // Create notification if there's a comment
        if (log.comment && log.comment.trim() !== "") {
          try {
            // Get action name for notification
            const action = await Action.query().findById(log.action_id);
            await createTaskCommentNotification({
              system_name: log.object_name,
              action_name: action?.name || "Unknown Task",
              comment: log.comment,
              comment_type: log.comment_type || "observation",
            });
          } catch (notificationError) {
            console.error(
              "Failed to create task notification:",
              notificationError
            );
          }
        }

        return taskLog;
      })
    );

    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        failed.push({
          input: logs[index],
          error: result.reason.message || result.reason,
        });
      }
    });

    if (failed.length === 0) {
      res.status(201).json({
        message:
          successful.length === 1
            ? "Task log created successfully."
            : `All ${successful.length} task logs created successfully.`,
        successfulItems: successful,
      });
    } else if (successful.length === 0) {
      res.status(400).json({
        message:
          "All task log insertions failed. Please check your data and try again.",
        failedItems: failed,
      });
    } else {
      res.status(207).json({
        message: `${failed.length} out of ${
          successful.length + failed.length
        } task log(s) failed. Please retry the failed item(s).`,
        failedItems: failed,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error creating task logs.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { action_id, object_type, object_name, comment } = req.body;

  try {
    await TaskLog.query().patchAndFetchById(id, {
      user_id: req.session.userId, // Get from session
      action_id,
      object_type,
      object_name,
      comment,
    });

    return res.status(200).json({
      message: `Task log was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating task log.",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const taskLogExists = await TaskLog.query().findById(id);
    if (!taskLogExists) {
      return res.status(404).json({ message: "Task log not found." });
    }

    await TaskLog.query().deleteById(id);
    res.status(200).json({
      message: `Task log was successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem deleting task log.",
      error: error.message,
    });
  }
};

export const recent = async (req, res) => {
  try {
    const { department_id, start_date, end_date, limit = 1000 } = req.query;

    if (!department_id || !start_date || !end_date) {
      return res.status(400).json({
        message: "department_id, start_date, and end_date are required",
      });
    }
    const [subdepartments, filters, pumps, department, actions] =
      await Promise.all([
        SubDepartment.query()
          .where("department_id", department_id)
          .where("is_active", 1),
        Filter.query()
          .join("sub_departments", "filters.sub_id", "sub_departments.id")
          .where("sub_departments.department_id", department_id)
          .where("filters.is_active", 1)
          .select("filters.*"),
        Pump.query()
          .join("sub_departments", "pumps.sub_id", "sub_departments.id")
          .where("sub_departments.department_id", department_id)
          .where("pumps.is_active", 1)
          .select("pumps.*"),
        Department.query().findById(department_id),
        Action.query().where("is_active", 1),
      ]);

    if (!department) {
      return res.status(404).json({
        message: `Department with ID ${department_id} not found`,
      });
    }

    // Create arrays of system names for filtering
    const subdepartmentNames = subdepartments.map((sd) => sd.name);
    const filterNames = filters.map((f) => f.name);
    const pumpNames = pumps.map((p) => p.name);
    const departmentName = department.name;

    const allSystemNames = [
      ...subdepartmentNames,
      ...filterNames,
      ...pumpNames,
      departmentName,
    ];
    const taskLogs = await TaskLog.query()
      .where("performed_at", ">=", start_date)
      .where("performed_at", "<=", end_date)
      .where("is_complete", 1)
      .whereIn("object_name", allSystemNames)
      .orderBy("performed_at", "desc")
      .limit(parseInt(limit));

    res.json({
      taskLogs,
      systems: {
        subdepartments,
        filters,
        pumps,
        department,
      },
      actions,
    });
  } catch (error) {
    console.error("Error fetching recent task logs:", error);
    res.status(500).json({
      message: "Problem retrieving recent task logs.",
      error: error.message,
    });
  }
};
