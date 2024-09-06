import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class AIReviewer {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async reviewAnswer(question, answer, rubric) {
        console.log('Starting AI review on server...');
        console.log('Question:', question);
        console.log('Answer:', answer);
        console.log('Rubric:', JSON.stringify(rubric));

        try {
            console.log('Sending request to OpenAI...');
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an expert interviewer tasked with evaluating answers to interview questions. Use the provided rubric to score and provide feedback. Return the scores and feedback in a JSON format." },
                    { role: "user", content: `Question: ${question}\nAnswer: ${answer}\nRubric: ${JSON.stringify(rubric)}` }
                ],
                temperature: 0.7,
                max_tokens: 500
            });
            console.log('Received response from OpenAI:', JSON.stringify(response, null, 2));

            const parsedResponse = this.parseAIResponse(response);
            console.log('Parsed AI response:', parsedResponse);
            return parsedResponse;
        } catch (error) {
            console.error('Error in AI review:', error);
            if (error.response) {
                console.error('OpenAI API response:', JSON.stringify(error.response.data, null, 2));
            }
            throw new Error('Failed to get AI review: ' + error.message);
        }
    }

    parseAIResponse(response) {
        const content = response.choices[0].message.content;
        console.log('Raw content:', content);

        // Remove code block markers if present
        const jsonContent = content.replace(/```json\n|\n```/g, '').trim();

        try {
            const parsedContent = JSON.parse(jsonContent);
            console.log('Successfully parsed JSON:', parsedContent);
            return parsedContent;
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            throw new Error('Failed to parse AI response: ' + error.message);
        }
    }
}

export default AIReviewer;