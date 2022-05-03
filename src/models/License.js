import mongoose from "mongoose";
const paginate = require("mongoose-paginate-v2");
import crypto from "crypto";

const licenseSchema = new mongoose.Schema({
  serial: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  name: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  activeSeats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  activeCount: { type: Number, required: true, default: 0 },
  maxSeates: { type: Number, required: true },
  type: { type: String, required: true },
  memo: { type: String },
});

licenseSchema.plugin(paginate);

licenseSchema.static("encrypt", function (text) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const IV_LENGTH = 16;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = cipher.update(text);

  return iv.toString("hex") + ":" + Buffer.concat([encrypted, cipher.final()]).toString("hex");
});

licenseSchema.static("decrypt", function (text) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const decrypted = decipher.update(encryptedText);

  return Buffer.concat([decrypted, decipher.final()]).toString();
});

const License = mongoose.model("License", licenseSchema);

export default License;
