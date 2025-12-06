//cek jawaban pengguna sama kunci jawaban
export const checkSingleQuestion = (questionData, selectedAnswers) => {

    const correctOptions = questionData.options
        .filter(o => o.is_correct)
        .map(o => o.id);

    const isCountMatch = selectedAnswers.length === correctOptions.length;
    const allSelectedAreCorrect = selectedAnswers.every(id => correctOptions.includes(id));
    
    return isCountMatch && allSelectedAreCorrect;
};

//hitung total skor jawaban
export const calculateScore = (quizState) => {
    let correctCount = 0;
    const totalQuestions = quizState.questions.length;
    
    quizState.questions.forEach(q => {
        const selected = quizState.answers[q.id] || []; 
        
        const isCorrect = checkSingleQuestion(q, selected);
        
        if (isCorrect) {
            correctCount++;
        }
    });

    const score = (correctCount / totalQuestions) * 100;
    
    return { 
        correctCount, 
        totalQuestions, 
        score: Math.round(score) 
    };
};