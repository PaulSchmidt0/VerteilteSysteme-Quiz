var time = 10;
var answer = 0;
var answer_expectet = 3;
var user_interaction = false

function expandBox(self, selectedAnswer) { 
    answer = selectedAnswer
    var user_interaction = true
    var box1 = document.getElementById('Box');
    var otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box3, #Box4');

    if (!box1.classList.contains('expanded')) {
        box1.classList.add('expanded');
        otherBoxes.forEach(box => box.classList.add('hidden'));
        showLoader(box1);
    }
}

function updateAnswerDisplay() {
    answerDisplay.textContent = 'Selected Answer: ' + answer;
    console.log(answer); // Log answer to console
}

function showLoader(box) {
    // Add a loader to the box
    var loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="ball"></div><div class="ball"></div><div class="ball"></div>';
    box.innerHTML = '';  // Clear the box content
    box.appendChild(loader); 

const duration = time; // Duration in seconds
    const progressBar = document.getElementById('progress-bar');
    let width = 100; // Initial width in percentage
    let timeLeft = duration; // Remaining time in seconds
    const updateRate = 10; // Update rate in milliseconds

    const interval = setInterval(() => {
        timeLeft -= updateRate / 1000;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';

        if (timeLeft <= 0) {
            clearInterval(interval);
            box.removeChild(loader);
            box.innerHTML = 'Loading is complete. Here is the new content!';
        }
    }, updateRate);
}

function showLoader(box) {
    // Create the loader element
    var loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = '<div class="ball"></div><div class="ball"></div><div class="ball"></div>';

    // Clear the box content and append the loader
    box.textContent = '';
    box.appendChild(loader);
}

function removeLoader(box) {
    var loader = box.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const duration = time; // Duration in seconds
    const progressBar = document.getElementById('progress-bar');
    let width = 100; // Initial width in percentage
    let timeLeft = duration; // Remaining time in seconds
    const updateRate = 10; // Update rate in milliseconds

    const interval = setInterval(() => {
        timeLeft -= updateRate / 1000;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';

        if (timeLeft <= 0) {
            clearInterval(interval);
            document.querySelectorAll('.loader').forEach(loader => loader.style.display = 'none');
        }
    }, updateRate);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const duration = time; // Dauer in Sekunden
    const progressBar = document.getElementById('progress-bar');
    let width = 100; // Anfangsbreite in Prozent
    let timeLeft = duration; // Verbleibende Zeit in Sekunden
    const updateRate = 10; // Aktualisierungsrate in Millisekunden

    const interval = setInterval(() => {
        timeLeft -= updateRate / 1000;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';

        if (timeLeft <= 0) {
            clearInterval(interval);
        }
    }, updateRate);
});

//export { answer };
