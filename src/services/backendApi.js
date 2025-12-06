import { MOCK_QUIZ_DATA } from "../mock/quizData"; 
import { MOCK_USER_PREFS } from "../mock/userPrefs"; 

const QUIZ_GENERATE_URL = import.meta.env.VITE_QUIZ_GENERATE_URL;
const HINT_GENERATE_URL = import.meta.env.VITE_HINT_GENERATE_URL;
const RESET_ALL_URL = import.meta.env.VITE_RESET_ALL_URL;


//INI BUAT GENERATE SOAL 
export const fetchQuizDataAndPrefs = async (tutorialId, userId) => {
  console.log(`[API] Fetching quiz for tutorial=${tutorialId}, user=${userId}`);

  try {
    const response = await fetch(QUIZ_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        tutorial_id: tutorialId,
        user_id: userId,
        question_index: 0,
        count: 3
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    return {
      questions: json.questions,
      userPreferences: {
        theme: json.userPreferences.theme,
        fontStyle: json.userPreferences.fontStyle,
        fontSize: json.userPreferences.fontSize,
        layoutWidth: json.userPreferences.layoutWidth,
      },
      metadata: {
        tutorial_id: json.metadata.tutorial_id,
        user_id: json.metadata.user_id,
        startIndex: json.metadata.startIndex,
        count: json.metadata.count,
        contextText: json.metadata.contextText,
        moduleTitle: json.metadata.moduleTitle 
      }
    };
  } catch (err) {
    console.error("Backend gagal. Menggunakan MOCK.", err);

    // Fallback ke mock
    return {
      questions: MOCK_QUIZ_DATA,
      userPreferences: {
        theme: MOCK_USER_PREFS.theme,
        fontStyle: MOCK_USER_PREFS.fontStyle,
        fontSize: MOCK_USER_PREFS.fontSize,
        layoutWidth: MOCK_USER_PREFS.layoutWidth,
      },
      tutorialId,
      userId,
    };
  }
};


//INI BUAT HINT YANG PORT 3002
export const generateHintAI = async ({
  tutorialId,
  qid,
  question,
  contextText,
  studentAnswer = [],
  options = []
}) => {
  try {
    const response = await fetch(HINT_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        tutorial_id: tutorialId,
        qid: qid,
        question: question,
        context_text: contextText,
        student_answer: studentAnswer,
        options: options 
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    return json.data.hint;

  } catch (err) {
    console.error("AI Hint gagal. Menggunakan MOCK hint.", err);

    return "Hint tidak tersedia karena koneksi ke server gagal.";
  }
};

//RESET PER SOAL
export const resetSingleQuestion = async (tutorialId, userId, questionIndex) => {
  const response = await fetch(QUIZ_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tutorial_id: tutorialId,
      user_id: userId,
      question_index: questionIndex,
      count: 1
    }),
  });

  if (!response.ok) throw new Error("Reset single question failed");

  return await response.json();
};


//RESET SEMUA SOAL
export const resetAllQuestions = async (tutorialId, userId) => {
  try {
    const response = await fetch(RESET_ALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        user_id: userId
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();

  } catch (err) {
    console.error("Reset all questions failed:", err);
    throw err;
  }
};
