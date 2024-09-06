let questions = [];

export async function loadQuestions() {
    console.log('Attempting to load questions...');
    try {
        console.log('Fetching questions.json...');
        const response = await fetch('../data/questions.json');
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        console.log('Current working directory:', window.location.href);
        throw error;
    }
}

export function selectQuestion(company, type) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let filteredQuestions = questions.filter(q => 
                    (!company || q.Company === company) &&
                    (!type || q["Question Type (e.g. Product, Strategy)"] === type)
                );

                if (filteredQuestions.length === 0) {
                    resolve('No questions match the selected criteria. Please try different filters.');
                } else {
                    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
                    resolve(filteredQuestions[randomIndex]["What was the interview question?"]);
                }
            } catch (error) {
                reject(error);
            }
        }, 500);
    });
}

export const getCompanies = () => questions.length > 0 ? [...new Set(questions.map(q => q.Company))] : [];
export const getQuestionTypes = () => questions.length > 0 ? [...new Set(questions.map(q => q["Question Type (e.g. Product, Strategy)"]))] : [];