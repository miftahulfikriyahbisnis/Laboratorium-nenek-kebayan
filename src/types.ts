export interface StoryFragment {
  missionId: number;
  unlocked: boolean;
  title: string;
  storyText: string;
  chemicalWisdom: string;
  recipeName: string;
  recipeIngredients: string[];
  scientificFormula: string;
}

export interface Mission {
  id: number;
  title: string;
  topic: string;
  subtitle: string;
  herbalContext: string;
  storyFragment: string;
  challengeQuestion: string;
  theoryConnection: string;
  knownVariables: { label: string; value: string }[];
  objectives: string[];
  scientificConcept: {
    title: string;
    summary: string;
    formula: string;
  };
  experimentConfig: {
    cauldronName: string;
    reagentAName: string;
    reagentAUnit: string;
    reagentAMin: number;
    reagentAMax: number;
    reagentAStep: number;
    reagentADefault: number;
    
    reagentBName: string;
    reagentBUnit: string;
    reagentBMin: number;
    reagentBMax: number;
    reagentBStep: number;
    reagentBDefault: number;

    // Target conditions
    targetReagentA: number;
    targetReagentB: number;
    toleranceA: number;
    toleranceB: number;

    indicatorName: string;
    colorStates: {
      under: { color: string; bgClass: string; label: string; feedback: string };
      target: { color: string; bgClass: string; label: string; feedback: string };
      over: { color: string; bgClass: string; label: string; feedback: string };
    };
  };
  sampleQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StudentProgress {
  studentName: string;
  currentMissionId: number;
  completedMissions: number[]; // e.g. [1, 2]
  missionAttempts: Record<number, number>; // missionId -> attempt count
  missionTimeSpent: Record<number, number>; // missionId -> total seconds spent on mission
  consultationLocked: Record<number, boolean>; // missionId -> boolean
  chatHistories: Record<number, ChatMessage[]>; // missionId -> ChatMessage[]
  startedAt: string;
  completedAt?: string;
}

export interface ExperimentState {
  valA: number;
  valB: number;
  stirred: boolean;
  timeLeft: number; // 60 seconds countdown
  isRunning: boolean;
  isPausedByTabBlur: boolean;
  currentAttempt: number;
  lastFeedback: {
    status: 'idle' | 'under' | 'over' | 'success';
    message: string;
    color: string;
  };
}

export type ScreenState = 
  | 'HOME' 
  | 'STORY_DIALOGUE' 
  | 'AI_CONSULTATION' 
  | 'EXPERIMENT' 
  | 'ALL_COMPLETED';
