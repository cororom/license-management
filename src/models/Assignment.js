import mongoose from "mongoose";
const paginate = require("mongoose-paginate-v2");

const assignmentSchema = new mongoose.Schema({
  license: { type: mongoose.Schema.Types.ObjectId, ref: "License" },
  ip: { type: String, required: true },
  company: { type: String, required: true },
  name: { type: String, required: true },
  user: { type: String, required: true },
  assignedNumbers: { type: Number, required: true },
  activationDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  memo: { type: String },
});

assignmentSchema.plugin(paginate);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
