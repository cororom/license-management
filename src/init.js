import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import app from "./server";

const PORT = process.env.PORT;
const IP = process.env.IP;

const handleListening = () => console.log(`🚀${IP}:${PORT}🚀`);

app.listen(PORT, IP, handleListening);
