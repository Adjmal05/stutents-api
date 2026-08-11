import { Router, Request, Response, NextFunction } from "express";
import { studentService } from "../services/student.service";

const router = Router();


router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await studentService.getAll();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});


router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await studentService.getById(req.params.id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});


router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await studentService.update(req.params.id, req.body);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await studentService.patch(req.params.id, req.body);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export const studentController = router;
