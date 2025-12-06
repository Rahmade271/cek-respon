import React from "react";
import logoWelcome from "../images/logo-welcome.png";

export default function WelcomeScreen({ tutorialTitle, onStartQuiz, userPrefs }) {
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-[var(--bg-primary)] text-[var(--text-primary)]
        font-[var(--font-primary)]
        transition-colors duration-300

      "
    >

      <div className="
        w-[var(--max-width-card)]

        ">
      <div
        className="
          lc-card
          p-6 sm:p-8 lg:p-10
          rounded-2xl shadow-xl
          border-2 border-[var(--text-primary)]/20
          transition-all duration-300
        "
      >
        {/* LOGO + BRAND */}
        <div className="flex flex-col items-center mb-3 sm:mb-5 text-center">
          <div className="relative mb-0 sm:mb-0">
            <div className="absolute inset-0 bg-[var(--blue-primary)]/20 rounded-full blur-2xl animate-pulse"></div>
            <img
              src={logoWelcome}
              alt="LearnCheck Logo"
              className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="font-title font-bold text-[var(--blue-primary)]">
              LearnCheck!
            </h1>

            <div className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[var(--blue-primary)]/3 border border-[var(--blue-primary)]/20">
              <p className="font-mini font-semibold text-[var(--blue-primary)]">
                Formative Assessment Powered with AI
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent mb-3 sm:mb-5"></div>

        {/* MODULE CARD */}
        <div
          className="
            relative overflow-hidden
            p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg mb-6 sm:mb-6
            bg-[var(--white-primary)]/3
            border border-[var(--text-primary)]/20
            transition-all duration-300
            hover:shadow-xl hover:border-[var(--text-primary)]/30
          "
        >

          <div className="relative z-10">
            <p className="text-center text-xs sm:text-sm mb-2 sm:mb-3 text-[var(--text-primary)]/70">
            Submodul Pembelajaran
          </p>

            <h2 className="font-heading text-center font-bold text-[var(--text-primary)] leading-snug break-words">
              {tutorialTitle || "Submodul Pembelajaran"}
            </h2>
          </div>
        </div>

        {/* START BUTTON */}
        <button
          onClick={onStartQuiz}
          className="
            w-full py-3 sm:py-4
            font-body font-semibold rounded-2xl
            text-white bg-[var(--blue-primary)]
            hover:brightness-110 hover:shadow-lg hover:scale-[1.02]
            active:brightness-95 active:scale-[0.98]
            transition-all duration-200
            shadow-md
            relative overflow-hidden
            group
          "
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Mulai
          </span>
          
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        {/* FOOTER NOTE */}
        <p className="text-center font-mini text-[var(--text-primary)]/50 mt-6">
          Klik tombol di atas untuk memulai kuis pembelajaran
        </p>
      </div>
      </div>
    </div>
  );
}
