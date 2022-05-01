import License from "../models/License";
import Assignment from "../models/Assignment";

export const getBoard = async (target, page, search) => {
  let board = {};
  let query;
  const field = search.target;
  // const skip = page !== undefined ? process.env.BOARD_RPP * (page - 1) : 0;
  if (!search) {
    query = {};
    // board = await target.find({}).sort({ _id: -1 }).skip(skip).limit(process.env.BOARD_RPP);
  } else {
    if (search.target === "") {
      query = { $or: [{ company: { $regex: new RegExp(`${search.keyword}`, "i") } }, { name: { $regex: new RegExp(`${search.keyword}`, "i") } }] };
    } else {
      // const field = search.target;
      query = field !== "license" ? { [field]: { $regex: new RegExp(`${search.keyword}`, "i") } } : { [field]: search.keyword };
    }
    // board = await target
    //   .find({ $or: [{ company: { $regex: new RegExp(`${keyword}`, "i") } }, { name: { $regex: new RegExp(`${keyword}`, "i") } }] })
    //   .sort({ _id: -1 })
    //   .skip(skip)
    //   .limit(process.env.BOARD_RPP);
  }
  let options = {
    page: page ? page : 1,
    limit: process.env.BOARD_RPP,
    sort: { _id: -1 },
  };
  if (target === Assignment) {
    options.populate = "license";
  }
  if (target === License) {
    options.populate = "activeSeats";
  }
  await target.paginate(query, options, (err, result) => {
    console.log(err);
    board = result;
  });
  return board;
};

export const getMenu = async () => {
  let menu = {};
  const list = await License.find({}, "company name");
  list.forEach((element) => {
    const { company, name } = element;
    if (!Object.keys(menu).includes(company)) {
      menu[company] = [name];
    } else {
      if (menu[company].includes(name) === false) {
        menu[company].push([name]);
      }
    }
  });
  return menu;
};
