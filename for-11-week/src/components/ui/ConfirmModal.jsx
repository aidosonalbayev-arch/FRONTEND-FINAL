import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/modalSlice";

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, message, itemId, itemType } = useSelector(
    (state) => state.modal,
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    window.dispatchEvent(
      new CustomEvent("confirm-delete", { detail: { itemId, itemType } }),
    );
    dispatch(closeModal());
  };

  const handleCancel = () => dispatch(closeModal());

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary modal-btn" onClick={handleCancel}>
            Отмена
          </button>
          <button className="btn-danger modal-btn" onClick={handleConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
