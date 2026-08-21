interface Props {
  studentName: string;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export function ConfirmDeleteModal({ studentName, onCancel, onConfirm, deleting }: Props) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card modal-card--narrow" onClick={(e) => e.stopPropagation()}>
        <p className="modal-card__eyebrow">Action irréversible</p>
        <h2 className="modal-card__title">Retirer cette fiche ?</h2>
        <p className="modal-card__subtitle">
          La fiche de <strong>{studentName}</strong> sera définitivement supprimée du registre.
        </p>
        <div className="modal-card__actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Annuler
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
