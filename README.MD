# Gemini AI Chatbot

A simple chatbot application that utilizes the Gemini AI model to generate human-like responses to user input.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Introduction

This repository contains a basic chatbot application that uses the Gemini AI model to generate responses to user input. The application is built using Node.js, Express, and the Gemini AI SDK.

## Features

- User-friendly chat interface
- Supports text-based input and output
- Utilizes the Gemini AI model for generating human-like responses
- Error handling and logging for debugging purposes

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/Basic_Chatbot_Using_Gemini.git
   ```
2. Install the required dependencies:
   ```sh
   npm install
   ```
3. Create a new file named `.env` in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
4. Start the application:
   ```sh
   node index.js
   ```

## Usage

- Open a web browser and navigate to [http://localhost:3000](http://localhost:3000)
- Enter a message in the chat input field and press the "Send" button
- The chatbot will respond with a generated message

## API Documentation

### POST `/api/chat`

Sends a user's message to the Gemini AI model and returns a generated response.

**Request Body:**
```json
{
  "prompt": "The user's message (string)"
}
```

**Response:**
```json
{
  "reply": "The generated response from the Gemini AI model (string)"
}
```

## Troubleshooting

- If you encounter any issues with the application, check the console logs for error messages.
- Ensure that your Gemini API key is valid and properly configured in the `.env` file.