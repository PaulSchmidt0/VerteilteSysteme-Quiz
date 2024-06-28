var time = 10;
var answer = 0;
var answer_expected = 3; 
var user_interaction = false;

function expandBox(self, selectedAnswer) { 
    answer = selectedAnswer; 
    user_interaction = true; 
    var box1 = document.getElementById('answer');
    var otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box3, #Box4');

    if (!box1.classList.contains('expanded')) {
        box1.classList.add('expanded');
        otherBoxes.forEach(box => box.classList.add('hidden'));
        showLoader(box1);
    }
}

function showLoader(box) {
    var loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="ball"></div><div class="ball"></div><div class="ball"></div>';
    
    box.innerHTML = '';
    box.appendChild(loader); 
}

document.addEventListener('DOMContentLoaded', (event) => {
    const duration = time; 
    const progressBar = document.getElementById('progress-bar');
    let width = 100;
    let timeLeft = duration; 
    const updateRate = 10; 

    const interval = setInterval(() => {
        timeLeft -= updateRate / 1000;
        width = (timeLeft / duration) * 100;
        progressBar.style.width = width + '%';

        if (timeLeft <= 0) {
            clearInterval(interval);
            document.querySelectorAll('.loader').forEach(loader => loader.style.display = 'none');
            showTextAfterLoader();
        }
    }, updateRate);
});


function showTextAfterLoader() {
    var box1 = document.getElementById('answer');
    if (answer === answer_expected) {
        box1.innerHTML = '<div class="customMessage">richtig</div>'; 
    } else {
        box1.innerHTML = '<div class="customMessage">falsch</div>'; 
    }
}

