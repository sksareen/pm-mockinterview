import { selectQuestion, loadQuestions, getCompanies, getQuestionTypes } from './questionSelector.js';
import { startTimer, stopTimer } from './timer.js';
import AnswerInput from './answerInput.js';
import AIReviewer from './aiReviewer.js';

class InterviewApp {
    constructor() {
        this.currentStep = 'preparation';
        this.selectedQuestion = null;
        this.timeLimit = 0;
        this.answer = '';
        this.score = 0;
        this.feedback = '';
        this.answerInput = new AnswerInput('answer-input');
        this.aiReviewer = new AIReviewer();

        this.initializeApp();
    }

    async initializeApp() {
        console.log('Initializing app...');
        try {
            console.log('Loading questions...');
            await loadQuestions();
            console.log('Questions loaded, populating filters...');
            this.populateFilters();
            console.log('Filters populated, initializing event listeners...');
            this.initializeEventListeners();
            console.log('App initialization complete.');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            alert('Failed to load questions. Please check the console for more information and ensure questions.json is in the correct location.');
        }
    }

    populateFilters() {
        const populateSelect = (elementId, options) => {
            const select = document.getElementById(elementId);
            if (!select) {
                console.error(`Element with id '${elementId}' not found`);
                return;
            }
            select.innerHTML = '<option value="">All</option>' + 
                options.map(option => `<option value="${option}">${option}</option>`).join('');
        };

        populateSelect('company', getCompanies());
        populateSelect('question-type', getQuestionTypes());
        console.log('Filters populated');
    }

    initializeEventListeners() {
        const addListener = (id, event, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.error(`Element with id '${id}' not found`);
            }
        };

        addListener('start-interview', 'click', () => this.startInterview());
        addListener('submit-answer', 'click', () => this.submitAnswer());
        addListener('try-again', 'click', () => this.tryAgain());
        addListener('new-question', 'click', () => this.newQuestion());

        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTimeLimit(e.target));
        });
    }

    async startInterview() {
        if (this.timeLimit === 0) {
            alert('Please select a time limit.');
            return;
        }
    
        try {
            this.currentStep = 'answer';
            const company = document.getElementById('company').value;
            const questionType = document.getElementById('question-type').value;
            console.log(`Starting interview with company: ${company}, question type: ${questionType}`);
            this.selectedQuestion = await selectQuestion(company, questionType);
            console.log('Selected question:', this.selectedQuestion);
            this.updateUI();
            startTimer(this.timeLimit * 60, this.timeUp.bind(this));
        } catch (error) {
            console.error('Failed to start interview:', error);
            alert('Failed to start interview. Please try again.');
            this.reset();
        }
    }

    submitAnswer() {
        this.answer = this.answerInput.getContent();
        console.log('Submitted answer:', this.answer);
        stopTimer();
        this.reviewAnswer();
    }

    async reviewAnswer() {
        console.log('Reviewing answer');
        try {
            document.getElementById('review-loading').classList.remove('hidden');
            const rubric = await this.loadRubric();
            console.log('Loaded rubric:', rubric);
            const review = await this.aiReviewer.reviewAnswer(this.selectedQuestion, this.answer, rubric);
            console.log('AI review result:', review);
            this.score = review.overallScore;
            this.feedback = review.feedback;
            this.currentStep = 'review';
            this.updateUI();
            console.log('Answer reviewed successfully');
        } catch (error) {
            console.error('Failed to review answer:', error);
            alert('Failed to review answer. Please try again.');
            this.reset();
        } finally {
            document.getElementById('review-loading').classList.add('hidden');
        }
    }


    async loadRubric() {
        try {
            const response = await fetch('data/rubric.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading rubric:', error);
            throw new Error('Failed to load rubric');
        }
    }

    tryAgain() {
        console.log('Trying again with the same question');
        this.answerInput.setContent(this.answer);
        this.currentStep = 'answer';
        this.updateUI();
        startTimer(this.timeLimit * 60, this.timeUp.bind(this));
    }

    newQuestion() {
        console.log('Starting new question');
        this.reset();
        this.updateUI();
    }

    timeUp() {
        console.log('Time is up, auto-submitting answer');
        alert('Time is up! Submitting your answer now.');
        this.submitAnswer();
    }

    selectTimeLimit(button) {
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.timeLimit = parseInt(button.dataset.time);
        console.log(`Selected time limit: ${this.timeLimit} minutes`);
    }

    reset() {
        console.log('Resetting interview state');
        this.currentStep = 'preparation';
        this.selectedQuestion = null;
        this.answer = '';
        this.score = 0;
        this.feedback = '';
        this.answerInput.clear();
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
        this.timeLimit = 0;
    }

    updateUI() {
        console.log(`Updating UI for step: ${this.currentStep}`);
        document.getElementById('preparation').classList.toggle('hidden', this.currentStep !== 'preparation');
        document.getElementById('answer').classList.toggle('hidden', this.currentStep !== 'answer');
        document.getElementById('review').classList.toggle('hidden', this.currentStep !== 'review');

        if (this.currentStep === 'answer') {
            document.getElementById('question-display').textContent = this.selectedQuestion;
        } else if (this.currentStep === 'review') {
            document.getElementById('score-display').textContent = `${Math.round(this.score * 100)}%`;
            const feedbackElement = document.getElementById('feedback');
            feedbackElement.innerHTML = ''; // Clear previous feedback
            
            if (typeof this.feedback === 'string') {
                feedbackElement.textContent = this.feedback;
            } else if (typeof this.feedback === 'object') {
                for (const [criterion, feedback] of Object.entries(this.feedback)) {
                    const criterionElement = document.createElement('div');
                    criterionElement.innerHTML = `<strong>${criterion}:</strong> ${feedback}`;
                    feedbackElement.appendChild(criterionElement);
                }
            } else {
                console.error('Unexpected feedback format:', this.feedback);
                feedbackElement.textContent = 'Error displaying feedback';
            }
        }
        console.log('UI update complete');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing InterviewApp');
    new InterviewApp();
});

export default InterviewApp;