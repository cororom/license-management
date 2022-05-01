import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = async (req, res) => {
  return res.render("signin");
};

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const user = await User.findOne({ username });
  if (!user) {
    req.flash("error", "아이디를 확인해 주세요.");
    return res.status(400).render("signin");
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    req.flash("error", "비밀번호를 확인해 주세요.");
    return res.status(400).render("signin");
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getLogout = (req, res) => {
  req.session.loggedIn = false;
  req.flash("info", "로그아웃");
  return res.redirect("/");
};
