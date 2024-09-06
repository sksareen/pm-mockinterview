import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import AIReviewer from './aiReviewer.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
  process.exit(1);
}

console.log('OPENAI_API_KEY is set:', process.env.OPENAI_API_KEY.slice(0, 5) + '...');

const aiReviewer = new AIReviewer();

app.post('/api/review', async (req, res) => {
  console.log('Received review request');
  try {
    const { question, answer, rubric } = req.body;
    console.log('Request body:', { question, answer, rubric });
    
    if (!question || !answer || !rubric) {
      throw new Error('Missing required fields');
    }
    
    console.log('Calling AI reviewer...');
    const review = await aiReviewer.reviewAnswer(question, answer, rubric);
    console.log('AI review result:', review);
    
    // Check if the review already has an overallScore
    if (!review.overallScore) {
      // Calculate overall score
      const totalWeight = rubric.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
      const overallScore = Object.entries(review.scores).reduce((sum, [criterion, score]) => {
        const weight = rubric.criteria.find(c => c.name === criterion)?.weight || 0;
        return sum + (score * weight / totalWeight);
      }, 0);
      review.overallScore = Math.round(overallScore * 100) / 100;
    }
    
    res.json(review);
  } catch (error) {
    console.error('Error in review:', error);
    res.status(500).json({ error: 'Failed to review answer', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});