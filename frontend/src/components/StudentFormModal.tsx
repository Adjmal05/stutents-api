import { useState } from "react";
import type { FormEvent } from "react";
import type { Student, StudentInput } from "../types/student";

interface Props {
  initial?: Student | null;
  onCancel: () => void;
  onSave: (data: StudentInput) => Promise<void>;
}

export function StudentFormModal({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<StudentInput>({
    firstName: initial?.firstName || "",
    lastName: initial?.lastName || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    dateOfBirth: initial?.dateOfBirth ? initial.dateOfBirth.slice(0, 10) : "",
    address: initial?.address || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof StudentInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-card__eyebrow">
          {initial ? `Fiche n° ${initial.id.slice(0, 8)}` : "Nouvelle fiche"}
        </p>
        <h2 className="modal-card__title">
          {initial ? "Modifier l'étudiant" : "Ajouter un étudiant"}
        </h2>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="student-form__row">
            <label className="field">
              <span>Prénom</span>
              <input
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Nom</span>
              <input
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </label>

          <div className="student-form__row">
            <label className="field">
              <span>Téléphone</span>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>
            <label className="field">
              <span>Date de naissance</span>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span>Adresse</span>
            <input value={form.address} onChange={(e) => update("address", e.target.value)} />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <div className="modal-card__actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
