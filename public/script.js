// Get references to DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:3000/api/chat'; // Make sure this matches your Node.js server address and endpoint

// --- Helper Functions ---

/**
 * Adds a new message bubble to the chat display.
 * @param {string} text - The text content of the message.
 * @param {'user' | 'ai' | 'loading'} sender - The sender of the message ('user', 'ai', or 'loading').
 * @returns {HTMLElement | null} The created message element, or null if sender is 'loading' for a placeholder.
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-bubble');

    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else if (sender === 'ai') {
        messageDiv.classList.add('ai-message');
    } else if (sender === 'loading') {
        messageDiv.classList.add('loading-indicator', 'ai-message'); // Use ai-message styling for loading
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        return messageDiv; // Return element to be able to remove it later
    }
    
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return null; // No need to return for user/ai messages
}

/**
 * Removes a specific loading indicator element from the chat.
 * @param {HTMLElement} loadingElement - The loading element to remove.
 */
function removeLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// --- Main Chat Functionality ---

/**
 * Handles sending the user's message (prompt) to the backend.
 */
async function sendPrompt() {
    const prompt = messageInput.value.trim();

    // Don't send empty prompts
    if (prompt === '') {
        return;
    }

    // Display user's message in the chat
    addMessage(prompt, 'user');
    messageInput.value = ''; // Clear input field

    // Show a loading indicator while waiting for AI response
    const loadingIndicator = addMessage('AI sedang berpikir...', 'loading');

    try {
        // Send the prompt to your Node.js backend
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }), // Send 'prompt' as the key
        });

        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.json(); // Try to parse error message from backend
            throw new Error(`Error: ${response.status} - ${errorData.error || 'Terjadi kesalahan pada server.'}`);
        }

        const data = await response.json(); // Get JSON response
        removeLoading(loadingIndicator); // Hide loading indicator
        addMessage(data.reply, 'ai'); // Display AI's reply

    } catch (error) {
        console.error('Error sending prompt or receiving AI reply:', error);
        removeLoading(loadingIndicator); // Hide loading indicator even on error
        // Display a user-friendly error message in the chat
        addMessage('Maaf, ada masalah saat berkomunikasi dengan AI. Silakan coba lagi nanti.', 'ai');
    }
}

// --- Event Listeners ---

// Send message when the send button is clicked
sendButton.addEventListener('click', sendPrompt);

// Send message when Enter key is pressed in the input field
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendPrompt();
    }
});

// --- Initial Welcome Message ---
// Display a welcome message when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addMessage('Halo! Saya adalah *chatbot* yang ditenagai oleh Gemini AI. Ada yang bisa saya bantu?', 'ai');
});
