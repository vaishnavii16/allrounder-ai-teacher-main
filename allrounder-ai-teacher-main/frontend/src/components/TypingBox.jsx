import { useAITeacher, subjects, levels } from "../hooks/useAITeacher";
import { useState } from "react";

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const error = useAITeacher((state) => state.error);
  const clearError = useAITeacher((state) => state.clearError);
  const subject = useAITeacher((state) => state.subject);
  const setSubject = useAITeacher((state) => state.setSubject);
  const level = useAITeacher((state) => state.level);
  const setLevel = useAITeacher((state) => state.setLevel);
  
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  const ask = () => {
    if (question.trim()) {
      setLastQuestion(question);
      askAI(question);
      setQuestion("");
      clearError();
    }
  };

  const retry = () => {
    if (lastQuestion.trim()) {
      askAI(lastQuestion);
      clearError();
    }
  };

  const isRetryableError = error && (
    error.includes('temporarily busy') || 
    error.includes('overloaded') || 
    error.includes('503') ||
    error.includes('timed out')
  );

  return (
    <div className="z-10 max-w-[700px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">
          Ask Your AI Teacher Anything!
        </h2>
        <p className="text-white/65">
          Ask any question about {subject.toLowerCase()} and the AI teacher will explain it at a {level} level.
        </p>
      </div>

      {/* Subject and Level Selection */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-white/80 text-sm block mb-1">Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-800/60 p-2 rounded text-white border border-slate-600/50 focus:border-white/50 focus:outline-none"
          >
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-white/80 text-sm block mb-1">Level:</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-slate-800/60 p-2 rounded text-white border border-slate-600/50 focus:border-white/50 focus:outline-none"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 rounded-lg">
          <p className="text-sm font-medium">Error:</p>
          <p className="text-sm">{error}</p>
          <div className="flex gap-2 mt-2">
            {isRetryableError && lastQuestion && (
              <button 
                onClick={retry}
                className="text-xs bg-red-500/30 hover:bg-red-500/50 px-2 py-1 rounded transition-colors"
                disabled={loading}
              >
                Retry Last Question
              </button>
            )}
            <button 
              onClick={clearError}
              className="text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="What is photosynthesis? How do you solve quadratic equations? Explain Newton's laws..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white hover:bg-slate-100/30 transition-colors disabled:opacity-50"
            onClick={ask}
            disabled={!question.trim()}
          >
            Ask
          </button>
        </div>
      )}
    </div>
  );
};
