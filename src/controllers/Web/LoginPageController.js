import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../../models/User.js";
import { getInitials } from "../../utils/getInitials.js";

export async function login(req, res) {
  const users = await User.query()
    .select("id", "firstname", "lastname")
    .where("is_active", 1);

  const submittedUserId = req.body?.user_id;

  const input = {
    name: "pin",
    type: "password",
    placeholder: "Enter PIN",
    err: req.formErrorFields?.pin ? req.formErrorFields.pin : "",
    submittedUserId: parseInt(submittedUserId),
  };

  const renderLoginPage = () => {
    res.render("pages/login", {
      layout: "layouts/authentication",
      input,
      users,
      getInitials,
    });
  };

  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Problem destroying session:", err);
      }
      renderLoginPage();
    });
  } else {
    renderLoginPage();
  }
}

export async function authenticateLogin(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.formErrorFields = {};
    errors.array().forEach((error) => {
      req.formErrorFields[error.path] = error.msg;
    });
    return next();
  }

  try {
    const user = await User.query()
      .findById(req.body.user_id)
      .where("is_active", 1);

    if (user) {
      const pinMatches = bcrypt.compareSync(req.body.pin, user.pin);

      if (pinMatches) {
        req.session.regenerate((err) => {
          if (err) {
            return next(err);
          }

          req.session.userId = user.id;
          req.session.userEmail = user.email;
          req.session.isAuthenticated = true;

          req.session.save((err) => {
            if (err) {
              return next(err);
            }
            if (user.is_admin) {
              res.redirect("/departments");
            } else {
              res.redirect("/employee");
            }
          });
        });
      } else {
        req.formErrorFields = { pin: "Incorrect pincode." };
        return next();
      }
    } else {
      req.formErrorFields = { user_id: "User does not exist or is inactive." };
      return next();
    }
  } catch (error) {
    next(error);
  }
}
