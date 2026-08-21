import { pool } from "../configuration/database";

async function seed() {
  await pool.query(`
    INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address)
    VALUES
      ('Andry', 'Rakoto', 'andry.rakoto@hei.mg', '0341234567', '2004-03-12', 'Antananarivo'),
      ('Fara', 'Rasoa', 'fara.rasoa@hei.mg', '0339876543', '2003-11-05', 'Antananarivo')
    ON CONFLICT (email) DO NOTHING;
  `);

  console.log("Seed terminé.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Erreur lors du seed :", err);
  process.exit(1);
});
