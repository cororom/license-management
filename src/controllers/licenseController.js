import License from "../models/License";
import { getBoard, getMenu } from "./boardController";
import moment from "moment";

export const home = async (req, res) => {
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  return res.render("home", { menu, baseUrl });
};

export const getLicense = async (req, res) => {
  const {
    params: { page },
    query,
  } = req;
  if (page === "null") {
    return res.end();
  }
  let board = await getBoard(License, page, query);
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  board.pageList = [];
  if (board.docs.length > 0) {
    board.docs.forEach((element, index, theArray) => {
      let count = 0;
      const assignment = element.activeSeats;
      assignment.forEach((row) => {
        count += parseInt(row.assignedNumbers);
      });
      theArray[index].serial = License.decrypt(element.serial);
      theArray[index].activeCount = count;
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
  return res.render("licenses/main", { board, menu, query, baseUrl });
};

export const postLicense = (req, res) => {
  const {
    params: { page },
    body: { serial, company, name, issuedDate, expirationDate, activeSeats, maxSeates, memo },
  } = req;
};

export const getAdd = async (req, res) => {
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  return res.render("licenses/add", { menu, baseUrl });
};

export const postAdd = async (req, res) => {
  const {
    body: { serial, company, name, issuedDate, expirationDate, activeSeats, maxSeates, memo },
  } = req;
  const encrypt = await License.encrypt(serial);
  const license = await License.create({
    serial: encrypt,
    company,
    name,
    issuedDate,
    expirationDate,
    maxSeates,
    memo,
  });
  if (!license) {
    req.flash("error", "작성 실패");
    return res.status(500).redirect("back");
  }
  return res.status(200).redirect("/licenses/post/1");
};

export const deleteLicense = async (req, res) => {
  const {
    params: { id },
    headers: { referer },
  } = req;
  try {
    await License.findByIdAndDelete(id);
  } catch (error) {
    req.flash("error", error);
    return res.status(500).redirect("back");
  }
  return res.status(200).redirect("/licenses/post/1");
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const menu = await getMenu();
  const baseUrl = req.baseUrl;
  const license = await License.findById(id);
  license.serial = await License.decrypt(license.serial);
  return res.render("licenses/edit", { license, moment, menu, baseUrl });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { serial, company, name, issuedDate, expirationDate, activeSeats, maxSeates, memo },
  } = req;
  const encrypt = await License.encrypt(serial);
  try {
    await License.findByIdAndUpdate(id, {
      serial: encrypt,
      company,
      name,
      issuedDate,
      expirationDate,
      maxSeates,
      memo,
    });
  } catch (error) {
    req.flash("error", error);
    return res.status(500).redirect("back");
  }
  return res.status(200).redirect("/licenses/post/1");
};
