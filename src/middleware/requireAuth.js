import User from "../models/User.js";
import { getInitials } from "../utils/getInitials.js";

export default async (req, res, next) => {
  try {
    if (!req.session.isAuthenticated || !req.session.userId) {
      return res.redirect("/login");
    }

    const user = await User.query().findById(req.session.userId);
    if (!user) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Problem destroying session:", err);
        }
        return res.redirect("/login");
      });
      return;
    }

    req.user = user;

    res.locals.currentUser = {
      id: req.session.userId,
      email: req.session.userEmail,
      firstname: user.firstname,
      lastname: user.lastname,
      initials: getInitials(`${user.firstname} ${user.lastname}`),
      is_admin: user.is_admin,
    };

    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.redirect("/login");
  }
};
