import express from "express";
import dotenv from "dotenv";
import { studentController } from "./controllers/student.controller";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/students", studentController);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Students API opérationnelle" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
