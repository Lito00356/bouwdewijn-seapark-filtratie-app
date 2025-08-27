export default (req, res, next) => {
  if (!req.session.isAuthenticated || !req.session.userId) {
    return res.redirect("/login");
  }

  if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
    return res.redirect("/employee");
  }

  next();
};
