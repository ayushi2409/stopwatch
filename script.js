const display = document.querySelector('.display');
const startBtn = document.querySelector('.start');
const pauseBtn = document.querySelector('.pause');
const resetBtn = document.querySelector('.reset');
const lapBtn = document.querySelector('.lap');
const lapsList = document.querySelector('.laps');
const toggleModeBtn = document.querySelector('.toggle-mode');
const body = document.body;
let startTime;
let elapsedTime = 0;
let timerInterval;
let darkMode = false;

function displayTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    display.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        displayTime(elapsedTime);
    }, 10);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    startBtn.classList.add('active');
    pauseBtn.classList.remove('active');
    saveState();
}

function pauseTimer() {
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.classList.remove('active');
    pauseBtn.classList.add('active');
    saveState();
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    displayTime(elapsedTime);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.classList.remove('active');
    pauseBtn.classList.remove('active');
    lapsList.innerHTML = '';
    saveState();
}

function lapTimer() {
    const lapTime = document.createElement('li');
    lapTime.classList.add('lap-time');
    lapTime.textContent = display.textContent;
    lapsList.appendChild(lapTime);
}

function toggleMode() {
    darkMode = !darkMode;
    body.classList.toggle('dark-mode', darkMode);
    toggleModeBtn.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    saveState();
}

function saveState() {
    const state = {
        elapsedTime,
        darkMode,
        laps: Array.from(lapsList.children).map(li => li.textContent)
    };
    localStorage.setItem('stopwatchState', JSON.stringify(state));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('stopwatchState'));
    if (state) {
        elapsedTime = state.elapsedTime;
        darkMode = state.darkMode;
        displayTime(elapsedTime);
        body.classList.toggle('dark-mode', darkMode);
        toggleModeBtn.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
        state.laps.forEach(lap => {
            const lapTime = document.createElement('li');
            lapTime.classList.add('lap-time');
            lapTime.textContent = lap;
            lapsList.appendChild(lapTime);
        });
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', lapTimer);
toggleModeBtn.addEventListener('click', toggleMode);

document.addEventListener('DOMContentLoaded', loadState);