import { pool } from "../configuration/database";
import { Student, CreateStudentDTO, UpdateStudentDTO } from "../models/Student";


function mapRowToStudent(row: any): Student {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    dateOfBirth: row.date_of_birth ?? undefined,
    address: row.address ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const studentRepository = {
  async findAll(): Promise<Student[]> {
    const result = await pool.query("SELECT * FROM students ORDER BY created_at DESC");
    return result.rows.map(mapRowToStudent);
  },

  async findById(id: string): Promise<Student | null> {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    return result.rows[0] ? mapRowToStudent(result.rows[0]) : null;
  },

  async findByEmail(email: string): Promise<Student | null> {
    const result = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
    return result.rows[0] ? mapRowToStudent(result.rows[0]) : null;
  },

  async create(data: CreateStudentDTO): Promise<Student> {
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.firstName, data.lastName, data.email, data.phone ?? null, data.dateOfBirth ?? null, data.address ?? null]
    );
    return mapRowToStudent(result.rows[0]);
  },

  async update(id: string, data: CreateStudentDTO): Promise<Student | null> {
    const result = await pool.query(
      `UPDATE students
       SET first_name = $1, last_name = $2, email = $3, phone = $4, date_of_birth = $5, address = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [data.firstName, data.lastName, data.email, data.phone ?? null, data.dateOfBirth ?? null, data.address ?? null, id]
    );
    return result.rows[0] ? mapRowToStudent(result.rows[0]) : null;
  },

  async patch(id: string, data: UpdateStudentDTO): Promise<Student | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged: CreateStudentDTO = {
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      email: data.email ?? existing.email,
      phone: data.phone ?? existing.phone,
      dateOfBirth: data.dateOfBirth ?? (existing.dateOfBirth as unknown as string),
      address: data.address ?? existing.address,
    };

    return this.update(id, merged);
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
