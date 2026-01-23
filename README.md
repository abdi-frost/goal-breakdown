# Goal Breakdown

An AI-powered goal breakdown application that helps you transform ambitious goals into actionable steps. Simply describe what you want to achieve, and the application uses AI to break it down into 5 concrete, manageable steps with a complexity assessment.

## Features

- **AI-Powered Breakdown**: Uses Google Gemini API to intelligently decompose complex goals into actionable steps
- **Goal Management**: Create, view, and delete goals with persistent storage
- **User-Specific Goals**: Track goals per user with user ID-based filtering
- **Complexity Assessment**: Each goal receives a complexity score (1-10) to help you understand the effort required
- **Modern UI**: Clean, responsive chat interface built with Next.js and React
- **Real-time Interaction**: Interactive chat experience for goal creation and management

## Architecture

The application consists of two main components:

### Backend (FastAPI)
- RESTful API built with FastAPI and Python
- PostgreSQL database for persistent storage
- Google Gemini AI integration for goal breakdown
- SQLAlchemy ORM for database operations
- Health check and monitoring endpoints

### Frontend (Next.js)
- Modern React 19 with Next.js 16
- TypeScript for type safety
- TanStack Query for data fetching and caching
- Radix UI components for accessible UI elements
- Tailwind CSS for styling
- Lucide React for icons

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL database
- Google Gemini API key (optional - fallback generation available)

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost/goal_breakdown
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the FastAPI server:
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
# or npm install
# or yarn install
```

3. Configure the API endpoint (if needed) in your environment variables

4. Run the development server:
```bash
pnpm dev
# or npm run dev
# or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Open the application in your browser
2. Enter a goal in the chat input (e.g., "Launch a startup" or "Learn machine learning")
3. The AI will break down your goal into 5 actionable steps
4. View your goal history in the sidebar
5. Click on previous goals to view them again
6. Delete goals you no longer need

## API Endpoints

- `POST /goals` - Create a new goal with AI-generated steps
- `GET /goals` - List all goals
- `GET /goals/user/{user_id}` - Get goals for a specific user
- `GET /goals/{goal_id}` - Get a specific goal by ID
- `DELETE /goals/{goal_id}` - Delete a goal
- `GET /health` - Health check endpoint

## Technology Stack

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Google Generative AI (Gemini)
- Uvicorn
- Pydantic

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Tailwind CSS
- Radix UI
- Lucide React

## Development

### Backend Development

To run the backend with auto-reload:
```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend Development

To run the frontend with hot-reload:
```bash
cd frontend
pnpm dev
```

### Linting

Frontend linting:
```bash
cd frontend
pnpm lint
```

## License

This project is private and proprietary.

## Contributing

This is a private repository. Please contact the repository owner for contribution guidelines.
