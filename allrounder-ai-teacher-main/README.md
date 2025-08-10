# All-Rounder AI Teacher - MERN Stack

An interactive 3D AI teacher that can teach **any subject** with dynamic board content, built with the MERN stack (MongoDB ready, Express.js, React, Node.js) and Google Gemini AI.

## 🌟 Features

- 🤖 **AI-powered responses** for any subject using Google Gemini API
- 🗣️ **Free text-to-speech** using Web Speech API
- 📚 **Multi-subject learning**: Math, Science, Programming, History, and more
- 🎯 **3D animated teachers** (Alex & Morgan) in immersive classrooms
- � **Dynamic board content**: Formulas, diagrams, code blocks, and step-by-step guides
- 🎨 **Beautiful 3D classroom environment** with interactive elements
- 🔄 **MERN stack architecture** for scalability
- 📈 **Adaptive difficulty levels**: Beginner, Intermediate, Advanced

## 🏗️ Architecture

This is a full MERN stack application designed for educational versatility:

### Backend (Node.js + Express)
- RESTful API for AI educational services
- Google Gemini AI integration with subject-specific prompts
- Error handling and retry logic for reliability
- CORS configuration for frontend communication

### Frontend (React + Vite)
- React Three Fiber for 3D graphics and immersive experience
- Zustand for state management
- Dynamic component rendering based on subject matter
- TailwindCSS for responsive styling
- Interactive board content with animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### 1. Clone and Setup

```bash
git clone <repository-url>
cd allrounder-ai-teacher
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_gemini_api_key_here

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file as `GEMINI_API_KEY`

## 📁 Project Structure

```
allrounder-ai-teacher/
├── backend/                 # Express.js backend
│   ├── routes/
│   │   └── ai.js           # AI educational routes
│   ├── server.js           # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── BoardContent.jsx    # Dynamic board content
│   │   │   ├── MessagesList.jsx    # Educational responses
│   │   │   ├── TypingBox.jsx       # Question input
│   │   │   └── BoardSettings.jsx   # UI controls
│   │   ├── hooks/          # Custom hooks (Zustand store)
│   │   ├── services/       # API service layer
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets (3D models, images)
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎓 Supported Subjects

The All-Rounder AI Teacher can teach:

- **Mathematics**: Algebra, Calculus, Geometry, Statistics
- **Science**: Physics, Chemistry, Biology
- **Computer Science**: Programming, Algorithms, Data Structures
- **History**: World History, Events, Timelines
- **Geography**: Countries, Climate, Geology
- **Literature**: Analysis, Writing, Grammar
- **Languages**: Grammar, Vocabulary, Translation
- **Philosophy**: Logic, Ethics, Critical Thinking
- **Economics**: Markets, Finance, Trade
- **General**: Any topic you can think of!

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE="All-Rounder AI Teacher"
```

## 🌐 API Endpoints

### Backend API

- `GET /health` - Health check
- `GET /api/ai?question=...&topic=...&level=...` - Get educational response
- `POST /api/ai` - Alternative POST endpoint for educational content

### Example API Usage

```javascript
// Get educational response
const response = await fetch('http://localhost:5000/api/ai?question=What is photosynthesis?&topic=Biology&level=intermediate');
const data = await response.json();
```

## 🎨 Dynamic Board Content

The AI teacher creates different types of visual content based on the subject:

### Mathematics
- **LaTeX formulas** rendered beautifully
- **Step-by-step solutions** with clear explanations
- **Example problems** with worked solutions

### Science
- **Formulas and equations** with proper formatting
- **Diagram descriptions** for complex concepts
- **Real-world examples** and applications

### Programming
- **Syntax-highlighted code blocks**
- **Algorithm explanations** with pseudocode
- **Best practices** and common patterns

### General Subjects
- **Organized bullet points** for key concepts
- **Timeline layouts** for historical events
- **Structured explanations** with clear progression

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Build and deploy:

```bash
cd backend
npm start
```

### Frontend Deployment

1. Update `VITE_API_URL` to your production backend URL
2. Build and deploy:

```bash
cd frontend
npm run build
npm run preview
```

## 🔧 Development Commands

### Backend

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌍 Browser Compatibility

The Web Speech API is supported in modern browsers:
- ✅ Chrome/Chromium-based browsers
- ✅ Safari
- ✅ Firefox
- ⚠️ Edge (limited voice support)

For the best voice experience, we recommend using Chrome or Safari.

## � Usage Examples

### Mathematics
- "How do you solve quadratic equations?"
- "Explain the Pythagorean theorem"
- "What is integration in calculus?"

### Science
- "What is photosynthesis?"
- "Explain Newton's laws of motion"
- "How does DNA replication work?"

### Programming
- "What is object-oriented programming?"
- "How do sorting algorithms work?"
- "Explain recursion with examples"

### History
- "What caused World War I?"
- "Explain the Industrial Revolution"
- "Who was Napoleon Bonaparte?"

## 🆚 Advantages Over Traditional Learning

### Personalized Learning
1. **Adaptive Difficulty**: Adjusts to beginner, intermediate, or advanced levels
2. **Interactive Experience**: 3D environment keeps students engaged
3. **Immediate Feedback**: Instant responses to questions
4. **Multi-modal Learning**: Visual, auditory, and textual content

### Technology Benefits
1. **Scalability**: Can serve unlimited students simultaneously
2. **24/7 Availability**: Learn anytime, anywhere
3. **Consistent Quality**: Same high-quality explanations every time
4. **Cost-Effective**: No per-student fees or physical infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 5000 is available
2. **Frontend can't connect**: Verify backend is running and CORS is configured
3. **AI responses failing**: Check Gemini API key configuration
4. **3D models not loading**: Ensure public assets are copied correctly

### Debug Steps

1. Check backend health: `http://localhost:5000/health`
2. Verify API communication in browser developer tools
3. Check console logs for detailed error messages
4. Ensure all environment variables are set correctly

## 🔮 Future Enhancements

- **MongoDB Integration**: Store learning progress and history
- **User Authentication**: Personal accounts and progress tracking
- **Advanced Visualizations**: Interactive diagrams and 3D models
- **Mobile App**: React Native version for mobile learning
- **Real-time Collaboration**: Multi-user classroom sessions
- **Enhanced Math Rendering**: KaTeX integration for complex formulas
- **Custom Subject Creation**: Allow teachers to create custom subjects

---

🎓 **Start Learning Anything with Your AI Teacher Today!** 🤖✨
