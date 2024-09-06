import AIReviewer from '../../aiReviewer.js';

class ReviewScorer {
    constructor() {
        this.aiReviewer = new AIReviewer();
    }

    async scoreAnswer(question, answer) {
        try {
            const rubric = await this.loadRubric();
            const review = await this.aiReviewer.reviewAnswer(question, answer, rubric);
            return {
                overallScore: review.score,
                feedback: review.feedback
            };
        } catch (error) {
            console.error('Error in scoring answer:', error);
            throw new Error('Failed to score answer');
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
}

export default ReviewScorer;