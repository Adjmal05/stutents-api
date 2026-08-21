import { studentRepository } from "../repositories/student.repository";
import { Student, CreateStudentDTO, UpdateStudentDTO } from "../models/Student";
import { ApiError } from "../utils/ApiError";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "L'email fourni n'est pas valide");
  }
}

export const studentService = {
  async getAll(): Promise<Student[]> {
    return studentRepository.findAll();
  },

  async getById(id: string): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new ApiError(404, `Étudiant avec l'id ${id} introuvable`);
    }
    return student;
  },

  async create(data: CreateStudentDTO): Promise<Student> {
    if (!data.firstName || !data.lastName || !data.email) {
      throw new ApiError(400, "Les champs 'firstName', 'lastName' et 'email' sont obligatoires");
    }
    validateEmail(data.email);

    const existing = await studentRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, `Un étudiant avec l'email ${data.email} existe déjà`);
    }

    return studentRepository.create(data);
  },

  async update(id: string, data: CreateStudentDTO): Promise<Student> {
    await this.getById(id); // vérifie l'existence, sinon lève une 404
    if (!data.firstName || !data.lastName || !data.email) {
      throw new ApiError(400, "Les champs 'firstName', 'lastName' et 'email' sont obligatoires");
    }
    validateEmail(data.email);

    const updated = await studentRepository.update(id, data);
    return updated as Student;
  },

  async patch(id: string, data: UpdateStudentDTO): Promise<Student> {
    await this.getById(id);
    if (data.email) validateEmail(data.email);

    const patched = await studentRepository.patch(id, data);
    return patched as Student;
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await studentRepository.remove(id);
  },
};
