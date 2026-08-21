import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { studentsApi } from "../api/students";
import type { Student, StudentInput } from "../types/student";
import { StudentFormModal } from "../components/StudentFormModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

function initials(firstName: string, lastName: string) {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function StudentsPage() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [editing, setEditing] = useState<Student | null | "new">(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err: any) {
      setLoadError(err?.response?.data?.message || "Impossible de charger le registre");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q)
    );
  }, [students, query]);

  async function handleSave(data: StudentInput) {
    if (editing && editing !== "new") {
      const updated = await studentsApi.update(editing.id, data);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await studentsApi.create(data);
      setStudents((prev) => [created, ...prev]);
    }
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await studentsApi.remove(deleting.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleting.id));
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="registry">
      <header className="registry__topbar">
        <div>
          <p className="registry__eyebrow">Registre des étudiants</p>
          <h1 className="registry__title">HEI · Cohorte 2026</h1>
        </div>
        <div className="registry__account">
          <span className="registry__account-email">{user?.email}</span>
          <button className="btn-ghost" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="registry__toolbar">
        <input
          className="registry__search"
          placeholder="Rechercher un nom, un prénom, un email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-primary" onClick={() => setEditing("new")}>
          + Nouvelle fiche
        </button>
      </div>

      {loading && <p className="registry__status">Chargement du registre…</p>}
      {loadError && <p className="registry__status registry__status--error">{loadError}</p>}

      {!loading && !loadError && filtered.length === 0 && (
        <div className="registry__empty">
          <p className="registry__empty-mark">∅</p>
          <p>Aucune fiche ne correspond. Ajoute un étudiant pour commencer le registre.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="ledger">
          {filtered.map((s) => (
            <article className="ledger-row" key={s.id}>
              <div className="ledger-row__id">{initials(s.firstName, s.lastName)}</div>
              <div className="ledger-row__main">
                <p className="ledger-row__name">
                  {s.firstName} {s.lastName}
                </p>
                <p className="ledger-row__email">{s.email}</p>
              </div>
              <div className="ledger-row__meta">
                <span>{s.phone || "—"}</span>
                <span>Né(e) le {formatDate(s.dateOfBirth)}</span>
              </div>
              <div className="ledger-row__actions">
                <button className="btn-link" onClick={() => setEditing(s)}>
                  Modifier
                </button>
                <button className="btn-link btn-link--danger" onClick={() => setDeleting(s)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <StudentFormModal
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          studentName={`${deleting.firstName} ${deleting.lastName}`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
          deleting={isDeleting}
        />
      )}
    </div>
  );
}
