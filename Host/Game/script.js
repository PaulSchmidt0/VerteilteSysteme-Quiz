let currentQuestionIndex = 0;
let questions = [];

document.getElementById('next-button').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        callNextPage();
    } else {
        window.location.href = '/poll';
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
        answerElement.innerText = answer;
        answersDiv.appendChild(answerElement);
    });
}

async function fetchQuestions() {
    try {
        const response = await fetch('/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        questions = data;
        displayQuestion(currentQuestionIndex);
    } catch (error) {
        console.error('Error fetching questions:', error);
        document.getElementById('question').innerText = 'Failed to load questions. Please try again later.';
    }
}

fetchQuestions();

async function callNextPage() {
    try {
        const response = await fetch('/nextpagecall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error calling /nextpage route:', error);
    }
}
