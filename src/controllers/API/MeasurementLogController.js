import MeasurementLog from "../../models/Measurement_log.js";
import { createMeasurementCommentNotification } from "../../middleware/validation/API/helpers/NotificationService.js";
import SubDepartment from "../../models/Sub_department.js";

export const index = async (req, res) => {
  try {
    const { department, subdepartment, startDate, endDate, parameter } =
      req.query;

    let query = MeasurementLog.query()
      .withGraphFetched("[users, sub_departments.department]")
      .orderBy("measured_at", "desc");

    if (department) {
      query = query.whereExists(
        MeasurementLog.relatedQuery("sub_departments").where(
          "department_id",
          department
        )
      );
    }

    if (subdepartment) {
      query = query.where("sub_id", subdepartment);
    }

    if (startDate && endDate) {
      query = query.whereBetween("measured_at", [
        startDate,
        endDate + " 23:59:59",
      ]);
    } else if (startDate) {
      query = query.where("measured_at", ">=", startDate);
    } else if (endDate) {
      query = query.where("measured_at", "<=", endDate + " 23:59:59");
    }

    if (parameter && parameter !== "all") {
      query = query.whereRaw("JSON_EXTRACT(measurements, ?) IS NOT NULL", [
        `$.${parameter}`,
      ]);
    }

    const measurementLogs = await query;

    if (!measurementLogs) {
      return res.status(404).json({ message: "No measurement logs found" });
    }

    res.json(measurementLogs);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving measurement logs.",
      error: error.message,
    });
  }
};

export const show = async (req, res) => {
  const { id } = req.params;
  try {
    const measurementLog = await MeasurementLog.query().findById(id);

    if (!measurementLog) {
      return res.status(404).json({ message: "Measurement log not found." });
    }
    res.json(measurementLog);
  } catch (error) {
    res.status(500).json({
      message: "Problem retrieving a measurement log.",
      error: error.message,
    });
  }
};

export const store = async (req, res) => {
  const { sub_id, measurements, comment, comment_type } = req.body;
  try {
    await MeasurementLog.query().insert({
      user_id: req.session.userId,
      sub_id,
      measurements,
      comment,
      comment_type
    });

    // Create notification if there's a comment
    if (comment && comment.trim() !== "") {
      try {
        const subDepartment = await SubDepartment.query().findById(sub_id);

        await createMeasurementCommentNotification({
          sub_department_name: subDepartment?.name || "Unknown",
          comment: comment,
          comment_type: comment_type,
        });
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }
    }

    res.status(201).json({
      message: `Measurement log created.`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem creating a measurement log.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { sub_id, measurements, comment, comment_type } = req.body;
  try {
    await MeasurementLog.query().patchAndFetchById(id, {
      user_id: req.session.userId,
      sub_id,
      measurements,
      comment,
      comment_type,
    });

    return res.status(200).json({
      message: `Measurement log was successfully updated`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem updating measurement log.",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const measurementLogExists = await MeasurementLog.query().findById(id);
    if (!measurementLogExists) {
      return res.status(404).json({ message: "Measurement log not found." });
    }

    await MeasurementLog.query().deleteById(id);
    res.status(200).json({
      message: `Measurement log was successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problem deleting measurement log.",
      error: error.message,
    });
  }
};
