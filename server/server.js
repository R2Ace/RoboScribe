import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

// To use the .env file and keep our API key secret and safe
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create a new express application instance
const app = express();

// Allow cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json());

// Dummy data to test the API
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from RoboScribe',
    });
});

// Post route to get the prompt from the frontend and send it to the OpenAI API
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "You will be provided with statements, and your task is to convert them to standard English."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature: 2,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        });

        console.log("API Response:", JSON.stringify(response, null, 2));

        // Adjusted the data extraction based on the API response
        if (response && response.choices && response.choices[0] && response.choices[0].message) {
            res.status(200).send({
                bot: response.choices[0].message.content
            });
        } else {
            throw new Error('Unexpected API response structure.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message
        });
    }
});

// Serve the application at the given port
app.listen(3000, () => console.log('Server running on port http://localhost:3000'));
