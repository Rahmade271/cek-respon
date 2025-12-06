import React from "react";

export default function RepeatQuiz({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="repeat-quiz-title"
      aria-describedby="repeat-quiz-description"
    >
      <div
        className="
          w-full max-w-sm
          bg-[var(--bg-secondary)] text-[var(--text-primary)]
          p-5 sm:p-6
          rounded-xl shadow-lg
          border border-[var(--text-primary)]/15
          animate-fadeIn
        "
      >
        <h3
          id="repeat-quiz-title"
          className="text-base sm:text-lg font-bold mb-3"
        >
          Reset Semua Soal?
        </h3>

        <p
          id="repeat-quiz-description"
          className="text-xs sm:text-sm opacity-80 mb-6 leading-relaxed"
        >
          Semua status jawaban akan dihapus dan soal akan diganti ulang.
          Apakah kamu yakin ingin mereset?
        </p>

        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              px-3 sm:px-4 py-2
              rounded-lg border border-[var(--text-primary)]/60
              text-xs sm:text-sm font-medium
              hover:bg-[var(--bg-primary)]
              transition
            "
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              px-3 sm:px-4 py-2
              rounded-lg bg-red-600 text-white
              text-xs sm:text-sm font-semibold
              hover:brightness-110 active:brightness-95
              transition
            "
          >
            Ya, Reset
          </button>
        </div>
      </div>
    </div>
  );
}