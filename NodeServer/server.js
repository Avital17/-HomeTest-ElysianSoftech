const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors()); 
app.use(express.json()); 

const PORT = 5000;
const API_KEY = process.env.OPENAI_API_KEY;

app.get('/get-message', async (req, res) => {
    try {
      //console.log("hi");
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: "user", content: "Give me a random welcome message" }
                ],
                max_tokens: 20,
                temperature: 0.9 //Creativity
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        //console.log("hi");
        const message = response.data.choices[0].message.content;

        res.json({ toastMessage: message });

    } catch (error) {
        console.error("Error connecting:", error.message);
        res.status(500).json({ error: "Could not get message" });
    }
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});