import "dotenv/config";
import "./db.js";
import app from "./server";

const PORT = process.env.PORT;

const handleListening = () => console.log(`🚀localhost:${PORT}🚀`);

app.listen(PORT, handleListening);
