import { useTheme } from "../context/ThemeContext";

export default function ConfirmModal({ message, onCancel, onConfirm }) {
  const { theme } = useTheme();

  const modalBg = theme === "light" 
    ? "bg-light-surface border border-light-inputBorder" 
    : "bg-dark-surface border border-dark-inputBorder";

  const textColor = theme === "light" ? "text-light-text" : "text-dark-text";

  const cancelBtn = theme === "light"
    ? "bg-light-input text-light-text hover:bg-light-inputBorder"
    : "bg-dark-input text-dark-text hover:bg-dark-inputBorder";

  const deleteBtn = theme === "light"
    ? "bg-light-primary text-light-text hover:bg-light-primaryHover"
    : "bg-dark-primary text-dark-text hover:bg-dark-primaryHover";

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className={`${modalBg} p-6 rounded-lg text-center w-80 shadow-lg`}>
        <p className={`${textColor} mb-4 text-lg`}>{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded transition-colors font-medium ${cancelBtn}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded transition-colors font-medium ${deleteBtn}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
