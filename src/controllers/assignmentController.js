import License from "../models/License";
import Assignment from "../models/Assignment";
import { getBoard, getMenu } from "./boardController";
import url from "url";
import moment from "moment";

export const getAssignment = async (req, res) => {
  const {
    params: { page },
    query,
  } = req;
  if (page === "null") {
    return res.end();
  }
  let board = await getBoard(Assignment, page, query);
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  board.pageList = [];
  if (board.docs.length > 0) {
    board.docs.forEach((element, index, theArray) => {
      theArray[index].serial = License.decrypt(element.license.serial);
    });
    const countPage = parseInt(process.env.BOARD_PAGECOUNT);
    const startPage = parseInt((board.page - 1) / countPage) * countPage + 1;
    let endPage = startPage + countPage - 1;
    if (endPage > board.totalPages) {
      endPage = board.totalPages;
    }
    for (let i = startPage; i <= endPage; i++) {
      board.pageList.push(i);
    }
  }
  if (board.pageList.length === 0) {
    board.pageList = [1];
  }
  return res.render("assignments/main", { board, menu, query, baseUrl });
};

export const getAdd = async (req, res) => {
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  return res.render("assignments/add", { menu, baseUrl });
};

export const postAdd = async (req, res) => {
  const {
    body: { serial, ip, company, name, user, assignedNumbers, activationDate, expirationDate, memo },
  } = req;
  let license = "";
  const licenseAll = await License.find();
  licenseAll.forEach((element, index, theArray) => {
    const decrypt = License.decrypt(element.serial);
    if (decrypt === serial) {
      license = theArray[index];
    }
  });
  if (license.maxSeates < license.activeCount + assignedNumbers) {
    req.flash("error", "maxSeates check");
    return res.redirect("back");
  }
  //const encrypt = await License.encrypt(serial);
  const assignment = await Assignment.create({
    license: license._id,
    ip,
    company,
    name,
    user,
    assignedNumbers,
    activationDate,
    expirationDate,
    memo,
  });
  if (!assignment) {
    req.flash("error", "작성 실패");
    return res.status(500).redirect("back");
  }
  license.activeSeats.push(assignment._id);
  license.activeCount = assignedNumbers;
  await license.save();
  return res.status(200).redirect("/assignments/post/1");
};

export const deleteAssignment = async (req, res) => {
  const {
    params: { id },
    headers: { referer },
  } = req;
  try {
    const license = await License.find({ activeSeats: { $in: [id] } });
    const assignment = await Assignment.findByIdAndDelete(id);
    license.activeSeats.splice(license.activeSeats.indexOf(id), 1);
    license.activeCount = license.activeCount - assignment.assignedNumbers;
    await license.save();
  } catch (error) {
    req.flash("error", error);
    return res.status(500).redirect("back");
  }
  return res.status(200).redirect("/assignments/post/1");
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  const assignment = await Assignment.findById(id).populate("license");
  assignment.serial = await License.decrypt(assignment.license.serial);
  return res.render("assignments/edit", { assignment, moment, menu, baseUrl });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { serial, ip, company, user, assignedNumbers, activationDate, expirationDate, memo },
  } = req;
  //const encrypt = await License.encrypt(serial);
  try {
    await Assignment.findByIdAndUpdate(id, {
      ip,
      company,
      user,
      assignedNumbers,
      activationDate,
      expirationDate,
      memo,
    });
  } catch (error) {
    req.flash("error", error);
    return res.status(500).redirect("back");
  }
  return res.status(200).redirect("/assignments/post/1");
};
