import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

const PORT = process.env.PORT || 8000;
const DBPORT = process.env.DB_PORT;
const DBHOST = process.env.DB_HOST;
console.log(DBPORT, DBHOST);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
