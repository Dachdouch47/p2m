# Cybersecurity Intrusion Detection System

This project is a full-stack web application designed to detect malicious activities in network logs using machine learning techniques. It allows users to upload network log datasets, analyze them, and view the results of the analysis.

## Project Structure

```
cybersecurity-ids
├── frontend          # Frontend application built with React
│   ├── src
│   │   ├── components # Reusable components for the UI
│   │   ├── pages      # Different pages of the application
│   │   ├── services    # API service for backend communication
│   │   ├── types       # TypeScript types and interfaces
│   │   └── App.tsx     # Main entry point for the frontend
│   ├── package.json    # Frontend dependencies and scripts
│   └── tsconfig.json   # TypeScript configuration for the frontend
├── backend           # Backend application built with FastAPI (or Flask)
│   ├── src
│   │   ├── api        # API routes for handling requests
│   │   ├── ml         # Machine learning models and utilities
│   │   ├── database    # Database connection and schema
│   │   ├── services    # Services for log parsing and analysis
│   │   ├── types       # TypeScript types and interfaces for the backend
│   │   └── app.ts      # Main entry point for the backend
│   ├── package.json    # Backend dependencies and scripts
│   ├── tsconfig.json   # TypeScript configuration for the backend
│   └── requirements.txt # Python dependencies for the backend
├── README.md          # Project documentation
└── .gitignore         # Files to ignore in version control
```

## Installation & Setup

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 14+ and npm (for frontend)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn src.app:app --reload
   ```
   The backend API will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### Running Both Services
For full functionality, you need both the backend and frontend running simultaneously:
- **Backend API:** `http://localhost:8000`
- **Frontend Application:** `http://localhost:3000`

## Dependencies

### Backend (Python)
See [requirements.txt](backend/requirements.txt) for complete list:
- **FastAPI** - Modern web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **scikit-learn** - Machine learning algorithms
- **Pydantic** - Data validation using Python type annotations
- **python-multipart** - Streaming file upload support
- **python-dotenv** - Environment variable management

### Frontend (Node.js/npm)
See [frontend/package.json](frontend/package.json) for complete list:
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Axios** - HTTP client for API requests

## Features

- **File Upload:** Users can upload CSV datasets containing network logs for analysis.
- **Malicious Activity Detection:** The application utilizes machine learning models to detect various types of attacks based on the uploaded data.
- **Results Visualization:** Users can view detailed analysis results, including detected attack types and model performance metrics.

## Technologies Used

- **Frontend:** React, TypeScript
- **Backend:** FastAPI (or Flask), Python
- **Machine Learning:** scikit-learn, pandas
- **Database:** (Specify the database used, e.g., PostgreSQL, MongoDB)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.