import { create } from "zustand";
import { aiService } from "../services/api";

export const teachers = ["Nanami", "Naoki"]; // Keep original teacher names for 3D models

// Subject/Topic options
export const subjects = [
  "Mathematics",
  "Science", 
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Literature",
  "Languages",
  "Philosophy",
  "Economics",
  "General"
];

// Difficulty levels
export const levels = ["beginner", "intermediate", "advanced"];

// Helper function to get appropriate voices
const getVoices = () => {
  if (!('speechSynthesis' in window)) return [];
  
  const voices = speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.includes('en') || voice.lang.includes('EN')
  );
};

// Helper function to get preferred voice for teacher
const getTeacherVoice = (teacherName) => {
  const voices = getVoices();
  
  // Try to find a female voice for Nanami and male voice for Naoki
  if (teacherName === "Nanami") {
    return voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('nanami')
    ) || voices[0];
  } else if (teacherName === "Naoki") {
    return voices.find(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('man') ||
      voice.name.toLowerCase().includes('naoki')
    ) || voices[1] || voices[0];
  }
  
  return voices[0];
};

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.speechUtterance = null; // New teacher, reset speech utterance
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,
  subject: subjects[0],
  setSubject: (subject) => {
    set(() => ({
      subject,
    }));
  },
  level: levels[1], // intermediate by default
  setLevel: (level) => {
    set(() => ({
      level,
    }));
  },
  showSteps: true,
  setShowSteps: (showSteps) => {
    set(() => ({
      showSteps,
    }));
  },
  showExamples: true,
  setShowExamples: (showExamples) => {
    set(() => ({
      showExamples,
    }));
  },
  error: null,
  setError: (error) => {
    set(() => ({
      error,
    }));
  },
  askAI: async (question) => {
    if (!question) {
      return;
    }
    
    const message = {
      question,
      id: get().messages.length,
    };
    
    set(() => ({
      loading: true,
      error: null,
    }));

    const subject = get().subject;
    const level = get().level;

    try {
      // Ask AI via backend API
      console.log('Sending request to backend:', { question, subject, level });
      const data = await aiService.getEducationalResponse(question, subject, level);
      
      message.answer = data;
      message.subject = subject;
      message.level = level;

      set(() => ({
        currentMessage: message,
      }));

      set((state) => ({
        messages: [...state.messages, message],
        loading: false,
        error: null,
      }));
      
      get().playMessage(message);
    } catch (error) {
      console.error('Error asking AI:', error);
      set(() => ({
        loading: false,
        error: error.message || 'Failed to get response from AI teacher',
      }));
    }
  },
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
      error: null,
    }));

    if (!message.speechUtterance) {
      set(() => ({
        loading: true,
      }));

      // Use Web Speech API for TTS (browser-based, free)
      const text = message.answer.explanation || message.answer.content || "Response ready.";

      // Check if speech synthesis is supported
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set basic properties first
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Slightly slower for learning
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
          set(() => ({
            currentMessage: null,
          }));
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          set(() => ({
            currentMessage: null,
            loading: false,
            error: 'Speech synthesis failed',
          }));
        };

        // Wait for voices to load if they haven't already
        const setVoiceAndPlay = () => {
          const preferredVoice = getTeacherVoice(get().teacher);
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          message.speechUtterance = utterance;
          
          set(() => ({
            loading: false,
            messages: get().messages.map((m) => {
              if (m.id === message.id) {
                return message;
              }
              return m;
            }),
          }));

          // Stop any currently playing speech
          speechSynthesis.cancel();
          
          // Play the speech
          speechSynthesis.speak(utterance);
        };

        // Voices might not be loaded yet
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.onvoiceschanged = setVoiceAndPlay;
        } else {
          setVoiceAndPlay();
        }
      } else {
        console.warn('Speech synthesis not supported in this browser');
        set(() => ({
          loading: false,
          error: 'Speech synthesis not supported in this browser',
        }));
        return;
      }
    } else {
      // Stop any currently playing speech
      speechSynthesis.cancel();
      
      // Play the existing speech utterance
      speechSynthesis.speak(message.speechUtterance);
    }
  },
  stopMessage: (message) => {
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    set(() => ({
      currentMessage: null,
    }));
  },
  clearError: () => {
    set(() => ({
      error: null,
    }));
  },
}));
