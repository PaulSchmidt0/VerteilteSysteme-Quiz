let time = 20;
let user_interaction = false;
let answer = 0;
let testans = 4;
let pointsAdded = false;
const username = localStorage.getItem('username');
let redirected = false;
let timeLeft;

console.log("test2");
startQuiz();
handleStartClick();

function startQuiz() {
    const duration = time;
    const progressBar = document.getElementById('progress-bar');
    startTimer(duration, progressBar);
}

function startTimer(duration, progressBar) {
    let width = 100;
    let timeLeft = duration;
    let lastUpdateTime = Date.now();

    function update() {
        const now = Date.now();
        const elapsed = (now - lastUpdateTime) / 1000;
        timeLeft -= elapsed;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';
        lastUpdateTime = now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            document.querySelectorAll('.loader').forEach(loader => loader.style.display = 'none');
            if (!user_interaction) {
                expandBox(null, 0);
            }
            showTextAfterLoader(answer, testans);
        } else {
            requestAnimationFrame(update);
        }
    }

    const interval = setInterval(() => {
        if (!document.hidden) {
            update();
        } else {
            clearInterval(interval);
        }
    }, 100);
}

function expandBox(self, selectedAnswer) {
    answer = selectedAnswer;
    user_interaction = true;
    const box1 = document.getElementById('answer');
    const otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box3, #Box4');

    if (!box1.classList.contains('expanded')) {
        box1.classList.add('expanded');
        otherBoxes.forEach(box => box.classList.add('hidden'));
        showLoader(box1);
        handleStopClick();
    }
}

function showTextAfterLoader(answer, testans) {
    const box1 = document.getElementById('answer');
    const message = (answer === testans) ? '<div class="customMessage">richtig</div>' : '<div class="customMessage">falsch</div>';
    box1.innerHTML = message;
    if (answer === testans) addPoints(username, (timeLeft*100));
}

function showLoader(box) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="ball"></div><div class="ball"></div><div class="ball"></div>';
    box.innerHTML = '';
    box.appendChild(loader);
}

function addPoints(username, points) {
    if (!pointsAdded) {
        console.log("Punkte werden hinzugefügt!");
        fetch('/add-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, points })
        });
        pointsAdded = true;
    }
}

async function callNextPage() {
    try {
        const response = await fetch('/nextpagefetch', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        if (data.status3 === true && !redirected) {
            redirected = true;
            window.location.href = '/game/Q3';
        }
    } catch (error) {
        console.error('Fehler beim Aufrufen der /nextpage-Route:', error);
    }
}

const intervalId = setInterval(() => {
    if (!redirected) callNextPage();
    else clearInterval(intervalId);
}, 1000);

function startCountdown(time) {
    timeLeft = time;
    countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            console.log(`Time left: ${timeLeft} seconds`);
        } else {
            clearInterval(countdownInterval);
            console.log('Countdown finished');
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    return timeLeft;
}

function handleStartClick() {
    startCountdown(time);
}

function handleStopClick() {
    stopCountdown();
}

if (username) console.log(username);
