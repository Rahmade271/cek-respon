import React from "react";
import { checkSingleQuestion } from "../utils/quizLogic";
import correctLogo from "../images/correct-logo.png";
import wrongLogo from "../images/wrong-logo.png";
import hintLogo from "../images/hint-logo.png";

export default function QuestionCard({
  questionData,
  questionIndex,
  selectedAnswers,
  onSelect,
  isDisabled,
  theme,       
  hintText,
  aiHint,
  isHintVisible,
}) {
  const isCorrectOverall = checkSingleQuestion(questionData, selectedAnswers);

  const renderConsolidatedFeedback = () => {
    if (!isDisabled) return null;

    const baseClasses = `
      mt-6 p-5 sm:p-6 rounded-xl border-1
    `;

    // JAWABAN BENAR
    if (isCorrectOverall) {
      return (
        <div
          className={`
            ${baseClasses}
            bg-[var(--green-secondary)]
            border-[var(--green-primary)]
            text-[var(--green-primary)]
          `}
        >
          <p className="font-bold flex items-center mb-3 font-subtitle sm:font-heading">
            <img
              src={correctLogo}
              alt="Jawaban benar"
              className="w-8 h-8 mr-2"
            />
            <span>Benar! Kerja bagus!</span>
          </p>

          <p className="font-body leading-relaxed text-[var(--text-primary)]">
            {questionData.feedback}
          </p>
        </div>
      );
    }

    // JAWABAN SALAH
    return (
      <div
        className={`
          ${baseClasses}
          bg-[var(--red-secondary)]
          border-[var(--red-primary)]
          text-[var(--red-primary)]
        `}
      >
        <p className="font-bold flex items-center mb-3 font-subtitle sm:font-heading">
          <img
            src={wrongLogo}
            alt="Jawaban salah"
            className="w-8 h-8 mr-2"
          />
          <span>Salah! Coba lagi!</span>
        </p>

        <p className="font-body leading-relaxed mb-4 ml-10 text-[var(--text-primary)]">
          {questionData.feedback}
        </p>

        {/* HINT AI KETIKA JAWABAN SALAH */}
        {aiHint && (
          <div
            className={`
              mt-3 p-4 sm:p-5 rounded-lg border-1 ml-10
              bg-[var(--yellow-secondary)]
              border-[var(--yellow-primary)]
              text-[var(--yellow-primary)]
            `}
          >
            <p className="font-bold flex items-center mb-2 font-body sm:font-body">
              <img
                src={hintLogo}
                alt="Hint Logo"
                className="w-6 h-6 mr-2"
              />
              <span>Petunjuk</span>
            </p>
            <p className="font-body leading-relaxed pl-8 text-[var(--text-primary)]">
              {aiHint}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className=
       "w-full pt-5">
    
      {/* PERTANYAAN */}
      <p
        className={`
          font-body sm:font-body lg:font-body
          font-medium mb-5 sm:mb-6
          text-[var(--text-primary)]
         
        `}
      >
        {questionIndex}. {questionData.question}
      </p>

      {/* OPSI JAWABAN */}
      <div className="space-y-3 sm:space-y-4">
        {questionData.options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);

          let optionStyles = `
            border-1 rounded-lg
            font-body
            text-[var(--text-primary)]
            bg-[var(--bg-secondary)]
            transition-all
            ${!isDisabled ? "hover:bg-[var(--bg-primary)]/10" : ""}
          `;

          if (isDisabled) {
            if (option.is_correct) {
              optionStyles += `
                bg-[var(--green-secondary)]
                border-[var(--green-primary)]
                text-[var(--green-primary)]
              `;
            } else if (isSelected && !option.is_correct) {
              optionStyles += `
                bg-[var(--red-secondary)]
                border-[var(--red-primary)]
                text-[var(--red-primary)]
              `;
            }
          }

          return (
            <label
              key={option.id}
              className={`
                flex items-center gap-3
                p-3 sm:p-4
                cursor-pointer
                ${optionStyles}
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onSelect(questionData.id, option.id)}
                className="
                  mt-0.5 h-5 w-5
                  rounded border-gray-300
                  text-[var(--blue-primary)]
                  focus:ring-[var(--blue-primary)]
                "
              />
              <span className="flex-1 leading-relaxed">
                {option.text}
              </span>
            </label>
          );
        })}
      </div>

      {/* FEEDBACK BENAR / SALAH + AI HINT */}
      <div className="feedback-container">
        {renderConsolidatedFeedback()}
      </div>


      {/* HINT MANUAL (TOMBOL PETUNJUK) */}
      {isHintVisible && hintText && (
        <div
          className="
            mt-6 p-5 sm:p-6 rounded-lg border-1
            bg-[var(--yellow-secondary)]
            border-[var(--yellow-primary)]
            text-[var(--yellow-primary)]
          "
        >
          <p className="font-bold flex items-center mb-2 font-body sm:font-body">
            <img
              src={hintLogo}
              alt="Hint Logo"
              className="w-6 h-6 mr-3"
            />
            <span>Petunjuk</span>
          </p>
          <p className="font-body leading-relaxed ml-9 text-[var(--text-primary)]">
            {hintText}
          </p>
        </div>
      )}
    </div>
  );
}
