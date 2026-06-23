# AI Code Explainer & Notes Management System

A web application that allows users to manage their notes and projects, save code snippets, and get AI-powered explanations for their code.

The project is structured as a monorepo consisting of:
*   **`backend`**: Node.js & Express API with MongoDB integration and OpenAI features.
*   **`frontend`**: React SPA styled with Tailwind CSS, built using Vite.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) (installed automatically with Node.js)
*   [MongoDB](https://www.mongodb.com/) (either running locally or a MongoDB Atlas URI)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ai-code-explainer
```

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and start the API server:

```bash
# Navigate to backend directory
cd backend

# Install npm packages
npm install

# Create a .env file and configure the environment variables
# (See the "Environment Variables" section below)
```

#### Run Backend Server:
*   **Development mode** (runs with hot-reloading using `nodemon`):
    ```bash
    npm run dev
    ```
*   **Production mode** (runs standard node start):
    ```bash
    npm start
    ```
The backend server will run on: `http://localhost:3450`

---

### 3. Frontend Setup
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Start the Vite development server
npm run dev
```
The frontend application will start on: `http://localhost:5173` (or the next available port).

---

## ⚙️ Environment Variables (Backend)

Create a file named `.env` in the `/backend` directory and add the following keys:

```env
# MongoDB Connection URI (Local or Atlas)
mongodb=mongodb://localhost:27017/notes_app

# JWT Secret Key for Authentication
secretkey=your_super_secret_jwt_key

# The Port the server runs on
PORT=3450

# OpenAI API Key (Required for AI code explanations)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📦 Packages and Technologies Used

### Backend Dependencies (`/backend/package.json`)
*   **`express`**: Web framework for building the API endpoints.
*   **`mongoose`**: ODM to communicate with MongoDB.
*   **`jsonwebtoken`**: Secures endpoints using JSON Web Tokens.
*   **`bcryptjs`**: Hashes and encrypts user passwords.
*   **`cors`**: Enables cross-origin resource sharing with the frontend.
*   **`dotenv`**: Loads environment variables from the `.env` file.
*   **`openai`**: Integrates OpenAI's language models for code explanation.
*   **`express-validator`**: Validates incoming request data.
*   **`express-rate-limit`**: Limits repeated requests to API endpoints for security.
*   **`nodemon`** (devDependency): Automatically restarts the backend server when code changes.

### Frontend Dependencies (`/frontend/package.json`)
*   **`react` & `react-dom`**: The UI library.
*   **`react-router-dom`**: Handles page navigation and routing.
*   **`vite`**: Build tool and fast local development server.
*   **`axios`**: Sends HTTP requests to the backend server.
*   **`lucide-react`**: Beautiful and modern SVG icons.
*   **`tailwindcss`**: Utility-first CSS framework for custom, modern UI styling.
