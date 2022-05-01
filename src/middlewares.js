export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "License Management";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const returnMiddleware = (req, res, next) => {
  //console.log(req.headers);
  return res.end();
};
