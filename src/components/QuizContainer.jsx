import React, { useEffect, useState } from "react";
import { useUrlParams } from "../hooks/useUrlParams";
import useLocalStorage from "../hooks/useLocalStorage";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";
import WelcomeScreen from "./WelcomeScreen";
import { checkSingleQuestion, calculateScore } from "../utils/quizLogic";
import {
  fetchQuizDataAndPrefs,
  generateHintAI,
  resetSingleQuestion,
  resetAllQuestions,
} from "../services/backendApi";
import { applyUserThemeToDocument } from "../utils/applyUserThemeToDocument";
import hintLogoButton from "../images/hint-logo-button.png";
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";

export default function QuizContainer() {
  const { userId, tutorialId } = useUrlParams() || {};
  const storageKey = `LEARNCHECK_STATE_${userId}_${tutorialId}`;

  const [quizState, setQuizState] = useLocalStorage(storageKey, null);
  const [userPrefs, setUserPrefs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  const totalQuestions = quizState?.questions?.length || 0;
  const currentQuestion = quizState?.questions?.[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.id;
  const isCompleted = quizState?.isCompleted || false;

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const isCurrentQuestionSubmitted =
    quizState?.checkedStatus?.[currentQuestionId]?.submitted || false;
  const isCurrentQuestionCorrect =
    quizState?.checkedStatus?.[currentQuestionId]?.isCorrect || false;
  const isCurrentQuestionAnswered =
    (quizState?.answers?.[currentQuestionId]?.length || 0) > 0;
  const isAllQuestionsChecked =
    totalQuestions > 0 &&
    Object.keys(quizState?.checkedStatus || {}).length === totalQuestions;

  const withLoading =
    (handler, delay = 500) =>
    async (...args) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await handler(...args);
      } catch (err) {
        console.error("Error during loading process:", err);
      } finally {
        await new Promise((r) => setTimeout(r, delay));
        setIsLoading(false);
      }
    };

  const loadQuizData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuizDataAndPrefs(tutorialId, userId);
      setQuizState({
        questions: data.questions,
        userId,
        tutorialId,
        moduleTitle: data.metadata?.moduleTitle || "Submodul Pembelajaran",
        contextText: data.metadata?.contextText || "",
        answers: {},
        checkedStatus: {},
        aiHints: {},
        isCompleted: false,
        score: 0,
        userPreferences: data.userPreferences,
      });
      setUserPrefs(data.userPreferences || {});
    } catch (err) {
      console.error("Gagal memuat data kuis:", err);
      alert("Gagal memuat kuis.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state dasar ketika user berganti
  useEffect(() => {
    setIsWelcomeScreen(true);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsHintVisible(false);
  }, [userId]);

  // Inisialisasi quizState dari localStorage/backend
  useEffect(() => {
    const isStateValid =
      quizState && quizState.questions && quizState.questions.length > 0;
    if (!isStateValid) {
      loadQuizData();
    } else {
      setUserPrefs(quizState.userPreferences || {});
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, tutorialId, quizState]);

  // Terapkan preferensi tema ke <html>
  useEffect(() => {
    if (userPrefs?.theme) {
      applyUserThemeToDocument(userPrefs);
    }
  }, [userPrefs]);

  const handleAnswerSelect = (questionId, optionId) => {
    if (isCurrentQuestionSubmitted || isLoading || !quizState) return;

    const currentAnswers = quizState.answers[questionId] || [];
    const isSelected = currentAnswers.includes(optionId);
    const newAnswers = isSelected
      ? currentAnswers.filter((id) => id !== optionId)
      : [...currentAnswers, optionId];

    setQuizState({
      ...quizState,
      answers: {
        ...quizState.answers,
        [questionId]: newAnswers,
      },
    });
  };

  const handleNext = withLoading(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsHintVisible(false);
    }
  }, 300);

  const handlePrev = withLoading(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsHintVisible(false);
    }
  }, 300);

  const handleShowHint = () => {
    setIsHintVisible((prev) => !prev);
  };

  const handleCheckAnswer = async () => {
    if (isCurrentQuestionSubmitted || isLoading || !currentQuestion) return;

    setIsLoading(true);
    const qid = currentQuestion.id;
    const answers = quizState.answers[qid] || [];
    const isCorrect = checkSingleQuestion(currentQuestion, answers);
    const initialHint = currentQuestion.hint || null;

    // update status & hint awal
    setQuizState((prev) => ({
      ...prev,
      checkedStatus: {
        ...prev.checkedStatus,
        [qid]: {
          submitted: true,
          isCorrect,
          attemptCount: (prev.checkedStatus?.[qid]?.attemptCount || 0) + 1,
        },
      },
      aiHints: {
        ...prev.aiHints,
        [qid]: initialHint,
      },
    }));

    setIsHintVisible(false);

    // delay kecil untuk feedback UI
    await new Promise((r) => setTimeout(r, 300));

    if (isCorrect || initialHint) {
      setIsLoading(false);
      return;
    }

    // Kalau salah & belum ada hint, panggil AI
    try {
      const hint = await generateHintAI({
        tutorialId,
        qid,
        question: currentQuestion.question,
        contextText: quizState.contextText,
        studentAnswer: answers,
        options: currentQuestion.options,
      });

      setQuizState((prev) => ({
        ...prev,
        aiHints: {
          ...prev.aiHints,
          [qid]: hint || "Hint tidak tersedia.",
        },
      }));
    } catch (err) {
      console.error("Gagal generate hint AI:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewScore = withLoading(() => {
    const results = calculateScore(quizState);
    setQuizState({
      ...quizState,
      isCompleted: true,
      score: results.score,
      correctCount: results.correctCount,
    });
    setShowResults(true);
  }, 1000);

  const handleResetCurrentQuestion = withLoading(async () => {
    const qIndex = currentQuestionIndex;
    try {
      const newQuestionData = await resetSingleQuestion(
        tutorialId,
        userId,
        qIndex
      );

      const updatedQuestions = [...quizState.questions];
      updatedQuestions[qIndex] = newQuestionData.questions[0];

      const newAnswers = { ...quizState.answers };
      const newCheckedStatus = { ...quizState.checkedStatus };

      delete newAnswers[currentQuestionId];
      delete newCheckedStatus[currentQuestionId];

      setQuizState({
        ...quizState,
        questions: updatedQuestions,
        answers: newAnswers,
        checkedStatus: newCheckedStatus,
      });
    } catch (err) {
      console.error("Failed regenerate question:", err);
      alert("Gagal mengambil soal baru.");
      
      const newAnswers = { ...quizState.answers };
      const newCheckedStatus = { ...quizState.checkedStatus };

      delete newAnswers[currentQuestionId];
      delete newCheckedStatus[currentQuestionId];

      setQuizState({
        ...quizState,
        answers: newAnswers,
        checkedStatus: newCheckedStatus,
      });
    }
    setIsHintVisible(false);
  }, 700);

  const handleReset = withLoading(async () => {
    const currentTheme = userPrefs.theme;
    try {
      await resetAllQuestions(tutorialId, userId);
      await loadQuizData();
    } catch (err) {
      console.error("Reset gagal:", err);
      alert("Gagal mereset soal.");
    }
    setCurrentQuestionIndex(0);
    setIsHintVisible(false);
    setShowResults(false);
    setIsWelcomeScreen(true);
    setUserPrefs({ theme: currentTheme });
  }, 1000);

  const handleExitToFirstQuestion = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsHintVisible(false);
  };

  const handleStartQuiz = withLoading(async () => {
    if (!quizState || !quizState.questions || quizState.questions.length === 0) {
      await loadQuizData();
    }
    setIsWelcomeScreen(false);
  }, 800);

  const renderStatusBadge = () => {
    if (!isCurrentQuestionSubmitted) return null;
    return (
      <div
        className={`
          px-3 py-1.5 rounded-xl 
          font-mini font-semibold border-1
          ${
            isCurrentQuestionCorrect
              ? "bg-[var(--green-secondary)] border-[var(--green-primary)] text-[var(--green-primary)]"
              : "bg-[var(--red-secondary)] border-[var(--red-primary)] text-[var(--red-primary)]"
          }
        `}
      >
        {isCurrentQuestionCorrect ? "Benar" : "Salah"}
      </div>
    );
  };

  // Loading screen
  if (isLoading || !quizState || !currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)]">
        <div
          className="
            animate-spin rounded-full h-12 w-12
            border-4 border-[var(--text-primary)]/20 
            border-t-[var(--blue-primary)]
          "
          role="status"
          aria-label="loading"
        ></div>
        <p className="mt-4 font-body text-[var(--text-primary)]">
          Memuat Kuis...
        </p>
      </div>
    );
  }

  // Halaman hasil
  if (showResults) {
    const finalScore = {
      correct: quizState.correctCount || 0,
      total: quizState.questions.length,
      score: quizState.score || 0,
    };
    return (
      <QuizResults
        score={finalScore}
        theme={userPrefs.theme}
        onReset={handleReset}
        onExitToFirstQuestion={handleExitToFirstQuestion}
      />
    );
  }

  // Halaman welcome
  if (isWelcomeScreen && userPrefs) {
    return (
      <WelcomeScreen
        tutorialTitle={quizState.moduleTitle}
        onStartQuiz={handleStartQuiz}
        userPrefs={userPrefs}
      />
    );
  }

  // Style tombol menggunakan CSS variables
  const secondaryBtn = `
    px-4 sm:px-5 py-2.5 rounded-lg font-medium 
    font-mini
    border border-[var(--text-primary)] text-[var(--text-primary)]
    hover:bg-[var(--bg-primary)]/10
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;
  const primaryBtn = `
    px-5 sm:px-6 py-2.5 rounded-lg font-bold 
    font-mini
    bg-[var(--blue-primary)] text-[var(--white-primary)]
    hover:brightness-110 hover:shadow-lg
    active:brightness-95
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;
  const resetBtn = `
    px-4 sm:px-5 py-2.5 rounded-lg font-semibold 
    font-mini
    border border-red-500
    bg-red-500 text-[var(--white-primary)]
    hover:brightness-110 hover:shadow-lg
    active:brightness-95
    flex items-center gap-1
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  const isDark = userPrefs.theme === "dark";
  const logoSrc = isDark ? logoDark : logoLight;
  const titleColor = isDark
    ? "text-[var(--text-secondary)]"
    : "text-[var(--blue-primary)]";

  let MainActionButton;
  if (isCurrentQuestionSubmitted) {
    MainActionButton = (
      <button
        onClick={handleResetCurrentQuestion}
        className={resetBtn}
        disabled={isLoading}
      >
        <span>↻</span> Ulang
      </button>
    );
  } else if (isCurrentQuestionAnswered) {
    MainActionButton = (
      <button
        onClick={handleCheckAnswer}
        className={primaryBtn}
        disabled={isLoading}
      >
        Periksa
      </button>
    );
  } else {
    MainActionButton = (
      <button
        onClick={handleResetCurrentQuestion}
        className={resetBtn}
        disabled={isLoading}
      >
        <span>↻</span> Ulang
      </button>
    );
  }

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
      {/* UPDATE FIX: Wrapper card diubah menjadi fluid dengan max-width */}
      <div className="max-w-[var(--max-width-card)] w-full mx-auto px-4 sm:px-6">
        <div
          className="
            lc-card
            mx-auto
            overflow-hidden
            bg-[var(--bg-secondary)]
            border border-[var(--text-primary)]/20
            shadow-lg
            transition-all duration-300
          "
        >
          {/* HEADER */}
          <div className="px-2 sm:px-2 py-2 mb-5">
            {/* logo + brand + badge */}
            <div className="lc-header grid grid-cols-1 sm:grid-cols-3 items-center">
              <div className="flex items-center gap-2 header-left">
                <img
                  src={logoSrc}
                  alt="LearnCheck Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
                <div className="leading-tight">
                  <span className={`block font-subtitle sm:text-2xl font-bold ${titleColor}`}>
                    LearnCheck!
                  </span>
                  <span className={`block font-mini ${titleColor}`}>
                    Formative Assessment <br />
                    Powered with AI
                  </span>
                </div>
              </div>

              {/* judul submodul */}
              <div className="header-title items-center">
                <p className="font-body font-medium text-[var(--text-primary)]/80 text-left sm:text-center">
                  {quizState.moduleTitle}
                </p>
              </div>

              <div className="flex justify-start sm:justify-end pr-3 header-status">
                {renderStatusBadge()}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent"></div>

          {/* PROGRESS BAR - Sekarang di dalam header wrapper */}
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 mt-2">
            <p className="font-mini font-medium text-[var(--text-secondary)] opacity-70">
              Soal {currentQuestionIndex + 1} dari {totalQuestions}
            </p>
            <div className="flex-1 sm:max-w-xs ml-0 sm:ml-auto bg-[var(--text-primary)]/10 rounded-full h-2">
              <div
                className="bg-[var(--blue-primary)] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / totalQuestions) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent"></div>

          {/* QUESTION CARD */}
          <div className="pb-5 px-4 sm:px-5 pt-4 sm:pt-3 border-b border-[var(--text-primary)]/20">
            <QuestionCard
              key={currentQuestion.id}
              questionData={currentQuestion}
              questionIndex={currentQuestionIndex + 1}
              selectedAnswers={quizState.answers[currentQuestion.id] || []}
              onSelect={handleAnswerSelect}
              isDisabled={isCurrentQuestionSubmitted}
              theme={userPrefs.theme}
              hintText={currentQuestion.pre_hint}
              aiHint={quizState.aiHints?.[currentQuestion.id] || null}
              isHintVisible={isHintVisible}
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 sm:p-5">
            <div className="footer-actions">
              {/* LEFT: Hint & Score */}
              <div className="footer-secondary">
                <button
                  onClick={handleShowHint}
                  className="
                    w-full sm:w-auto 
                    px-4 sm:px-5 py-2.5 
                    bg-[var(--hint-button-yellow)]
                    text-[var(--text-light-primary)] rounded-lg font-semibold
                    font-mini
                    flex items-center justify-center gap-1
                    hover:brightness-110 hover:shadow-lg
                    active:brightness-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    border border-[var(--hint-button-yellow)]
                  "
                  disabled={!currentQuestion.pre_hint || isLoading}
                >
                  <img
                    src={hintLogoButton}
                    alt="Hint Logo"
                    className="w-4 h-4"
                  />
                  <span>Petunjuk</span>
                </button>

                {/* MainActionButton untuk mediumWidth (baris 2) */}
                <div className="main-action-mediumwidth">
                  {MainActionButton}
                </div>

                {isLastQuestion && isAllQuestionsChecked && (
                  <button
                    onClick={handleViewScore}
                    className="
                      w-full sm:w-auto 
                      px-5 sm:px-6 py-2.5 
                      bg-[var(--blue-primary)] text-[var(--white-primary)] font-bold
                      rounded-lg shadow-md
                      font-mini
                      hover:brightness-110 hover:shadow-lg
                      active:brightness-95 active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      border border-[var(--blue-primary)]
                    "
                    disabled={isLoading}
                  >
                    Lihat Skor
                  </button>
                )}
              </div>

              {/* RIGHT: Navigation & Main Action */}
              <div className="footer-navigation">
                <button
                  onClick={handlePrev}
                  disabled={isFirstQuestion || isLoading}
                  className={secondaryBtn}
                >
                  &lt; Sebelumnya
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLastQuestion || isLoading}
                  className={secondaryBtn}
                >
                  Selanjutnya &gt;
                </button>

                {/* MainActionButton untuk fullWidth (pojok kanan) */}
                <div className="main-action-fullwidth">
                  {MainActionButton}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}