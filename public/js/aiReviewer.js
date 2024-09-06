class AIReviewer {
    async reviewAnswer(question, answer, rubric) {
        console.log('Starting AI review...');
        console.log('Question:', question);
        console.log('Answer:', answer);
        console.log('Rubric:', rubric);

        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, answer, rubric }),
            });

            if (!response.ok) {
                console.error('Server response not OK:', response.status, response.statusText);
                const errorBody = await response.text();
                console.error('Error response body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('AI review result:', result);
            return result;
        } catch (error) {
            console.error('Error in AI review:', error);
            throw new Error('Failed to get AI review: ' + error.message);
        }
    }
}

export default AIReviewer;