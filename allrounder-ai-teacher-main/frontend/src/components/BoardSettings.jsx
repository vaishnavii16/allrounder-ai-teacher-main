import { teachers, useAITeacher } from "../hooks/useAITeacher";

export const BoardSettings = () => {
  const showSteps = useAITeacher((state) => state.showSteps);
  const setShowSteps = useAITeacher((state) => state.setShowSteps);

  const showExamples = useAITeacher((state) => state.showExamples);
  const setShowExamples = useAITeacher((state) => state.setShowExamples);

  const teacher = useAITeacher((state) => state.teacher);
  const setTeacher = useAITeacher((state) => state.setTeacher);

  const classroom = useAITeacher((state) => state.classroom);
  const setClassroom = useAITeacher((state) => state.setClassroom);

  return (
    <>
      <div className="absolute right-0 bottom-full flex flex-row gap-10 mb-20">
        {teachers.map((teacherName, idx) => (
          <div
            key={idx}
            className={`p-3 transition-colors duration-500 cursor-pointer ${
              teacher === teacherName ? "bg-white/80" : "bg-white/40"
            }`}
          >
            <div onClick={() => setTeacher(teacherName)}>
              <img
                src={`/images/${teacherName}.jpg`}
                alt={teacherName}
                className="object-cover w-40 h-40"
              />
            </div>
            <h2 className="text-3xl font-bold mt-3 text-center">{teacherName}</h2>
          </div>
        ))}
      </div>
      <div className="absolute left-0 bottom-full flex flex-row gap-2 mb-20">
        <button
          className={` ${
            classroom === "default"
              ? "text-white bg-slate-900/40 "
              : "text-white/45 bg-slate-700/20 "
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md cursor-pointer hover:bg-slate-900/60`}
          onClick={() => setClassroom("default")}
        >
          Default classroom
        </button>
        <button
          className={` ${
            classroom === "alternative"
              ? "text-white bg-slate-900/40 "
              : "text-white/45 bg-slate-700/20 "
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md cursor-pointer hover:bg-slate-900/60`}
          onClick={() => setClassroom("alternative")}
        >
          Alternative classroom
        </button>
      </div>
      <div className="absolute left-0 top-full flex flex-row gap-2 mt-20">
        <button
          className={` ${
            showSteps
              ? "text-white bg-slate-900/40 "
              : "text-white/45 bg-slate-700/20 "
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md cursor-pointer hover:bg-slate-900/60`}
          onClick={() => setShowSteps(!showSteps)}
        >
          Show Steps
        </button>
        <button
          className={` ${
            showExamples
              ? "text-white bg-slate-900/40 "
              : "text-white/45 bg-slate-700/20 "
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md cursor-pointer hover:bg-slate-900/60`}
          onClick={() => setShowExamples(!showExamples)}
        >
          Show Examples
        </button>
      </div>
    </>
  );
};
