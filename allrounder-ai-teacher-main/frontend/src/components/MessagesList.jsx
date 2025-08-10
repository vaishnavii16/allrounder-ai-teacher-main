import { useAITeacher } from "../hooks/useAITeacher";
import { BoardContent } from "./BoardContent";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const stopMessage = useAITeacher((state) => state.stopMessage);
  const { currentMessage } = useAITeacher();
  const showSteps = useAITeacher((state) => state.showSteps);
  const showExamples = useAITeacher((state) => state.showExamples);
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80`}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            All-Rounder AI Teacher
          </h2>
          <h2 className="text-6xl font-bold text-blue-400/90 italic mt-4">
            Learn Anything, Anytime
          </h2>
          <p className="text-4xl text-white/70 mt-6">
            Ask me about Math, Science, History, Programming, and more!
          </p>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i}>
          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/90 text-2xl font-bold uppercase px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  {message.subject || "General"}
                </span>
                <span className="text-white/70 text-xl px-2 py-1 rounded bg-black/30">
                  {message.level || "intermediate"}
                </span>
              </div>

              {/* Question */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg mb-4">
                <p className="text-3xl font-bold text-white">
                  Q: {message.question}
                </p>
              </div>

              {/* Main explanation */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg mb-4">
                <p className="text-2xl text-white/90 leading-relaxed">
                  {message.answer.explanation}
                </p>
              </div>

              {/* Dynamic board content */}
              <BoardContent 
                boardContent={message.answer.boardContent}
                steps={message.answer.steps}
                examples={message.answer.examples}
                keyPoints={message.answer.keyPoints}
                showSteps={showSteps}
                showExamples={showExamples}
              />
            </div>
            
            {/* Play/Stop button */}
            {currentMessage === message ? (
              <button
                className="text-white/65 hover:text-white transition-colors ml-4"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65 hover:text-white transition-colors ml-4"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Next topics suggestion */}
          {message.answer.nextTopics && message.answer.nextTopics.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                🚀 What to learn next:
              </h3>
              <div className="flex flex-wrap gap-2">
                {message.answer.nextTopics.map((topic, index) => (
                  <span 
                    key={index}
                    className="bg-orange-600/30 text-orange-100 px-3 py-1 rounded-full text-lg"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
