function expandBox1() {
    var box1 = document.getElementById('Box1');
    var otherBoxes = document.querySelectorAll('#Box2, #Box3, #Box4');
    
    box1.classList.toggle('expanded');
    otherBoxes.forEach(box => box.classList.toggle('hidden'));

    if (box1.classList.contains('expanded')) {
        box1.textContent = 'falsch';
    } else {
        box1.textContent = 'A';
    }
}

function expandBox2() {
    var box2 = document.getElementById('Box2');
    var otherBoxes = document.querySelectorAll('#Box1, #Box3, #Box4');
    
    box2.classList.toggle('expanded');
    otherBoxes.forEach(box => box.classList.toggle('hidden'));

    if (box2.classList.contains('expanded')) {
        box2.textContent = 'falsch';
    } else {
        box2.textContent = 'B';
    }
}

function expandBox3() {
    var box3 = document.getElementById('Box3');
    var otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box4');
    
    box3.classList.toggle('expanded');
    otherBoxes.forEach(box => box.classList.toggle('hidden'));

    if (box3.classList.contains('expanded')) {
        box3.textContent = 'richtig';
    } else {
        box3.textContent = 'C';
    }
}

function expandBox4() {
    var box4 = document.getElementById('Box4');
    var otherBoxes = document.querySelectorAll('#Box1, #Box2, #Box3');
    
    box4.classList.toggle('expanded');
    otherBoxes.forEach(box => box.classList.toggle('hidden'));

    if (box4.classList.contains('expanded')) {
        box4.textContent = 'falsch';
    } else {
        box4.textContent = 'D';
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    const duration = 30; // Dauer in Sekunden
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
