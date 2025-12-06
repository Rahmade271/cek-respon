import React, { useState } from "react";
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";
import RepeatQuiz from "./RepeatQuiz";

export default function QuizResults({
  theme,
  score,
  onReset,
  onExitToFirstQuestion,
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const { total, score: percentage } = score || {
    correct: 0,
    total: 0,
    score: 0,
  };

  const isPassing = percentage >= 70;

  // Data lingkaran skor
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Tema & warna
  const logoSrc = theme === "dark" ? logoDark : logoLight;
  const scoreColor = isPassing ? "var(--green-primary)" : "var(--red-primary)";
  const isDark = theme === "dark";
  const titleColor = isDark
    ? "text-[var(--text-primary)]"
    : "text-[var(--blue-primary)]";
 const greenWrapper = isDark
  ? "bg-[var(--green-secondary)] border border-[var(--green-primary)]"
  : "bg-[var(--green-primary)] border border-[var(--green-secondary)]";

const redWrapper = isDark
  ? "bg-[var(--red-secondary)] border border-[var(--red-primary)]"
  : "bg-[var(--red-primary)] border border-[var(--red-secondary)]";



  // Handler konfirmasi ulang kuis
  const handleResetClick = () => setShowConfirmReset(true);

  const handleConfirmReset = () => {
    setShowConfirmReset(false);
    onReset();
  };

  const handleCancelReset = () => setShowConfirmReset(false);

  return (
    <>
      <div
        className="
          min-h-screen w-full
          flex items-center justify-center
          text-[var(--text-primary)]
          transition-colors duration-300
          
          
        "
      >
        <div className="
        w-[var(--max-width-card)]

        ">
          {/* HEADER */}
          <header
            className="
              px-4 sm:px-6 py-3 sm:py-4
              flex items-center
              bg-[var(--bg-secondary)]
              border-b border-[var(--text-primary)]/20
              rounded-t-2xl shadow
            "
          >
            <img
              src={logoSrc}
              alt="LearnCheck Logo"
              className="w-14 h-14 sm:w-16 sm:h-16"
            />

            <div className="leading-tight">
              <h1 className={`font-subtitle font-bold ${titleColor}`}>
                LearnCheck!
              </h1>
              <p className={`font-mini ${titleColor}`}>
                Formative Assessment <br />
                Powered with AI
              </p>
            </div>
          </header>

          {/* CONTENT */}
          <div
            className="
              px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12
              rounded-b-2xl shadow
              bg-[var(--bg-secondary)]
              transition
            "
          >
            {/* Judul & deskripsi */}
            <div className="mb-8 sm:mb-10 text-center">
              <h1 className="font-title font-bold text-[var(--blue-primary)]">
                Kuis Berhasil Diselesaikan! 
              </h1>
              <p className="font-body opacity-80 text-[var(--text-primary)]">
                Tinjau hasil nilai Anda dan tingkatkan hasilnya di kuis berikutnya!
              </p>
            </div>

            {/* KOTAK RINGKASAN SKOR */}
            <div
              className="
                p-5 sm:p-5 lg:p-8 rounded-2xl border-1 shadow-sm mb-8
                bg-[var(--text-primary)]/3
                border-[var(--text-primary)]/20
              "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start min-h-[220px]">
                {/* Total Soal */}
                <div className="flex flex-col text-center items-center h-full">
                  <p className="font-heading font-semibold opacity-80">
                    Total Soal
                  </p>
                  <div className="flex justify-center items-center flex-1">
                    <p className="text-7xl font-bold">
                      {total}
                    </p>
                  </div>
                </div>


                {/* Score Circle */}
                <div className="flex flex-col items-center text-center h-full">
                  <p className="font-heading font-semibold opacity-80 mb-2 sm:mb-2">
                    Skor Kamu
                  </p>
                  <div className="flex justify-center items-center flex-1">
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56">
                    <svg
                      className="transform -rotate-90 w-full h-full"
                      viewBox="0 0 200 200"
                    >
                      {/* Lingkaran background */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="var(--text-primary)"
                        strokeWidth="5"
                        opacity="0.15"
                        fill="none"
                      />
                      {/* Lingkaran skor */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke={scoreColor}
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`
                          text-5xl font-bold
                          ${
                            isPassing
                              ? "text-[var(--green-primary)]"
                              : "text-[var(--red-primary)]"
                          }
                        `}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={onExitToFirstQuestion}
                className={`
                  py-3 sm:py-4 rounded-2xl font-bold
                  font-body
                  hover:brightness-95 active:brightness-95
                  transition ${greenWrapper}
                  text-[var(--white-primary)]
                `}
              >
                Lihat Riwayat Kuis
              </button>

              <button
                onClick={handleResetClick}
                className={`
                  py-3 sm:py-4 rounded-2xl font-bold
                  font-body sm:text-xl
                  hover:brightness-95 active:brightness-95
                  transition ${redWrapper}
                  text-[var(--white-primary)]
                  `} 
                  
              >
                Ulang Kuis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI ULANG KUIS */}
      <RepeatQuiz
        visible={showConfirmReset}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </>
  );
}
