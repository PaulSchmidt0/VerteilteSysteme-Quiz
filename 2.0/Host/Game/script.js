let currentQuestionIndex = 0;
let questions = [];

document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        window.location.href = '/poll';
        currentQuestionIndex = 0; // Zurück zur ersten Frage
        displayQuestion(currentQuestionIndex);
    }
});

function displayQuestion(index) {
    const question = questions[index];
    document.getElementById('question').innerText = question.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    question.answers.forEach((answer, i) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer');
        answerElement.innerText = `${answer}`;
        answersDiv.appendChild(answerElement);
    });
}

async function fetchQuestions() {
    const response = await fetch('/questions');
    const data = await response.json();
    questions = data;
    displayQuestion(currentQuestionIndex);
}

fetchQuestions();

