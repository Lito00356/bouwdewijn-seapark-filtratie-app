export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.redirect("/");
    }

    res.redirect("/login");
  });
}
