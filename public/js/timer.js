class Timer {
    constructor() {
        this.timerInterval = null;
        this.remainingTime = 0;
        this.timerCallback = null;
    }

    startTimer(durationInSeconds, callback) {
        this.stopTimer();
        this.remainingTime = durationInSeconds;
        this.timerCallback = callback;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        this.remainingTime--;
        this.updateTimerDisplay();

        if (this.remainingTime <= 0) {
            this.stopTimer();
            if (this.timerCallback) {
                this.timerCallback();
            }
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        const display = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = display;
            timerElement.classList.toggle('warning', this.remainingTime <= 60);
        }
    }

    padZero(number) {
        return number.toString().padStart(2, '0');
    }
}

const timer = new Timer();
export const startTimer = timer.startTimer.bind(timer);
export const stopTimer = timer.stopTimer.bind(timer);