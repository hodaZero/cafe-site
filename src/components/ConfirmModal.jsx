import React from "react";

export default function ConfirmModal({ message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-dark p-6 rounded-lg text-center w-80 shadow-lg border border-[#d3ad7f]/30">
        <p className="text-white mb-4 text-lg">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-[#7FBFD4] text-[#13131A] px-4 py-2 rounded hover:bg-[#6BAAC1] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#D97F7F] text-[#13131A] px-4 py-2 rounded hover:bg-[#C76B6B] transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
