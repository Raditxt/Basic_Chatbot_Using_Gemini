// Load environment variables from .env file at the very top of the script
// This ensures that process.env variables are available throughout the app.
require('dotenv').config();

// Import necessary modules for the Express application and Gemini AI integration
const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const cors = require('cors');             // Middleware to enable Cross-Origin Resource Sharing
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Google's SDK for Gemini API

// Initialize the Express application
const app = express();

// --- Configuration Variables ---
// Retrieve the server port from environment variables (from .env file).
// Defaults to 3000 if PORT is not specified in .env.
const port = process.env.PORT || 3000; 
// Retrieve the Gemini API Key from environment variables (from .env file).
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Middleware Setup ---
// Use bodyParser to parse JSON formatted request bodies.
// This is essential for receiving the user's prompt from the frontend.
app.use(bodyParser.json()); 
// Enable CORS for all origins.
// In a production environment, you might want to restrict this to specific origins for security.
app.use(cors()); 

// Serve static files from the 'public' folder.
// This line makes your HTML, CSS, and client-side JavaScript files accessible from the browser.
// For example, http://localhost:3000/index.html will serve the index.html file.
app.use(express.static('public')); 

// --- Gemini AI Initialization ---
let generativeAI;
let geminiModel;

// Check if the API key is available before initializing the Gemini AI client.
if (GEMINI_API_KEY) {
    // Instantiate the GoogleGenerativeAI client with the API key.
    generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Get the generative model instance.
    // "gemini-2.0-flash" is chosen for its speed, suitable for real-time chatbot interactions.
    geminiModel = generativeAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Gemini AI model initialized successfully. Ready to process chat requests!");
} else {
    // Log an error if the API key is missing, guiding the user to set it up.
    console.error("ERROR: GEMINI_API_KEY is not found in your .env file.");
    console.error("Please ensure your .env file in the project root contains: GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE");
    // In a production application, you might implement more robust error handling,
    // such as preventing the server from starting or disabling AI features.
}

// --- API Endpoint Definition ---
// Define a POST endpoint at '/api/chat'.
// This endpoint will receive chat prompts from the frontend.
app.post('/api/chat', async (req, res) => {
    // Extract the 'prompt' property from the request body.
    // This 'prompt' is the text input from the user in the frontend.
    const userPrompt = req.body.prompt; // Changed from req.body.message to req.body.prompt

    // --- Input Validation ---
    // Validate if the user prompt is provided and not just empty spaces.
    if (!userPrompt || userPrompt.trim() === '') {
        // Send a 400 Bad Request response if the prompt is empty.
        return res.status(400).json({ error: 'Prompt tidak boleh kosong.' }); // Updated error message
    }

    // --- AI Model Availability Check ---
    // Ensure the Gemini model was successfully initialized before attempting to use it.
    if (!geminiModel) {
        // Send a 500 Internal Server Error if the model isn't ready.
        return res.status(500).json({ error: 'Gemini AI model belum diinisialisasi. Periksa kunci API Anda di file .env.' });
    }

    // --- Gemini AI Interaction ---
    try {
        // Call the Gemini model to generate content based on the user's prompt.
        // The generateContent method sends the prompt to the AI.
        const result = await geminiModel.generateContent(userPrompt); // Using userPrompt
        // Await the response object from the AI.
        const response = await result.response;
        // Extract the plain text content from the AI's response.
        const aiReply = response.text();

        // --- Send Response to Frontend ---
        // Send the AI's reply back to the frontend as a JSON object.
        res.json({ reply: aiReply });

    } catch (error) {
        // --- Error Handling ---
        // Log the detailed error to the server console for debugging.
        console.error('Error processing chat request with Gemini AI:', error);
        // Send a user-friendly error message to the frontend.
        res.status(500).json({ error: 'Terjadi kesalahan saat berkomunikasi dengan Gemini AI. Silakan coba lagi nanti.' });
    }
});

// --- Server Start ---
// Start the Express server and make it listen for incoming HTTP requests on the specified port.
app.listen(port, () => {
    console.log(`Backend server berjalan di http://localhost:${port}`);
    console.log('Pastikan file .env Anda berisi GEMINI_API_KEY yang valid dan diset dengan benar.');
});
