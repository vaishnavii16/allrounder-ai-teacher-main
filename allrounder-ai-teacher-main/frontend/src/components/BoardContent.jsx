import { useState, useEffect } from "react";

// LaTeX Math renderer component (optional - you can install katex for better math rendering)
const MathFormula = ({ formula }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg my-4">
      <div className="text-2xl font-mono text-center text-gray-800">
        {formula}
      </div>
    </div>
  );
};

// Code snippet component
const CodeBlock = ({ code, language }) => {
  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm my-4">
      <div className="text-gray-400 text-xs mb-2">{language}</div>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  );
};

// Diagram placeholder component
const DiagramPlaceholder = ({ description }) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg my-4 text-center">
      <div className="text-blue-600 font-semibold">📊 Diagram</div>
      <div className="text-blue-800 mt-2">{description}</div>
      <div className="text-sm text-blue-600 mt-2">
        Visual representation would appear here
      </div>
    </div>
  );
};

// List component for steps or bullet points
const ListDisplay = ({ items, type = "ordered" }) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg my-4">
      {type === "ordered" ? (
        <ol className="list-decimal list-inside space-y-2 text-gray-800">
          {items.map((item, index) => (
            <li key={index} className="text-lg">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {items.map((item, index) => (
            <li key={index} className="text-lg">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main content renderer based on type
export const BoardContent = ({ boardContent, steps, examples, keyPoints, showSteps, showExamples }) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, [boardContent]);

  if (!boardContent) return null;

  return (
    <div className={`transition-all duration-500 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
      {/* Main board content */}
      {boardContent.type === "formula" && boardContent.formula && (
        <MathFormula formula={boardContent.formula} />
      )}
      
      {boardContent.type === "code" && boardContent.content && (
        <CodeBlock 
          code={boardContent.content} 
          language={boardContent.language || "javascript"} 
        />
      )}
      
      {boardContent.type === "diagram" && boardContent.diagram && (
        <DiagramPlaceholder description={boardContent.diagram} />
      )}
      
      {boardContent.type === "text" && boardContent.content && (
        <div className="bg-white p-4 rounded-lg shadow-lg my-4">
          <div className="text-lg text-gray-800 text-center">
            {boardContent.content}
          </div>
        </div>
      )}
      
      {boardContent.type === "list" && boardContent.content && (
        <ListDisplay items={boardContent.content} />
      )}

      {/* Steps section */}
      {showSteps && steps && steps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-3 bg-blue-600/80 p-2 rounded">
            📝 Steps to Follow:
          </h3>
          <ListDisplay items={steps} type="ordered" />
        </div>
      )}

      {/* Key Points section */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-3 bg-green-600/80 p-2 rounded">
            💡 Key Points:
          </h3>
          <ListDisplay items={keyPoints} type="unordered" />
        </div>
      )}

      {/* Examples section */}
      {showExamples && examples && examples.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-3 bg-purple-600/80 p-2 rounded">
            🎯 Examples:
          </h3>
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded-lg">
                <div className="text-purple-800 font-medium">
                  Example {index + 1}: {example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
