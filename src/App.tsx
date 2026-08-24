import React, { useState, useEffect } from 'react';
import { MISSIONS, STORY_FRAGMENTS } from './data/missionsData';
import {
  StudentProgress,
  ScreenState,
  ChatMessage,
  Mission,
} from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { StoryDialogueScreen } from './components/StoryDialogueScreen';
import { AIConsultationScreen } from './components/AIConsultationScreen';
import { ExperimentScreen } from './components/ExperimentScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { RecipeBookModal } from './components/RecipeBookModal';
import { MissionSuccessModal } from './components/MissionSuccessModal';
import { FocusLostAlert } from './components/FocusLostAlert';
import { BackgroundMap } from './components/BackgroundMap';

const STORAGE_KEY = 'NENEK_KEBAYAN_LAB_PROGRESS_V1';

export default function App() {
  // Load initial progress from session/local storage
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      studentName: '',
      currentMissionId: 1,
      completedMissions: [],
      missionAttempts: {},
      missionTimeSpent: {},
      consultationLocked: {},
      chatHistories: {},
      startedAt: new Date().toISOString(),
    };
  });

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [activeMissionId, setActiveMissionId] = useState<number>(1);
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState<boolean>(false);
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    missionId: number;
    attempts: number;
  } | null>(null);

  const [isTabPaused, setIsTabPaused] = useState<boolean>(false);

  // Sync state to local/session storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Active mission time tracking (accumulates seconds spent on current mission)
  useEffect(() => {
    if (isTabPaused || currentScreen === 'HOME' || currentScreen === 'ALL_COMPLETED') {
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const currentSpent = prev.missionTimeSpent?.[activeMissionId] || 0;
        return {
          ...prev,
          missionTimeSpent: {
            ...(prev.missionTimeSpent || {}),
            [activeMissionId]: currentSpent + 1,
          },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTabPaused, currentScreen, activeMissionId]);

  const activeMission: Mission =
    MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  const handleUpdateName = (name: string) => {
    setProgress((prev) => ({ ...prev, studentName: name }));
  };

  const handleUpdateAttempts = (missionId: number, attempts: number) => {
    setProgress((prev) => ({
      ...prev,
      missionAttempts: {
        ...prev.missionAttempts,
        [missionId]: attempts,
      },
    }));
  };

  const handleSelectMission = (missionId: number) => {
    setActiveMissionId(missionId);
    // Initialize attempt count if not set
    if (!progress.missionAttempts[missionId]) {
      handleUpdateAttempts(missionId, 1);
    }
    setCurrentScreen('STORY_DIALOGUE');
  };

  const handleProceedToAIConsultation = () => {
    setCurrentScreen('AI_CONSULTATION');
  };

  const handleProceedToExperiment = () => {
    // Lock the AI consultation screen for this mission
    setProgress((prev) => ({
      ...prev,
      consultationLocked: {
        ...prev.consultationLocked,
        [activeMissionId]: true,
      },
    }));
    setCurrentScreen('EXPERIMENT');
  };

  const handleUpdateChatHistory = (missionId: number, messages: ChatMessage[]) => {
    setProgress((prev) => ({
      ...prev,
      chatHistories: {
        ...prev.chatHistories,
        [missionId]: messages,
      },
    }));
  };

  const handleMissionSuccess = (missionId: number, attempts: number) => {
    const newCompleted = Array.from(new Set([...progress.completedMissions, missionId]));
    const isLast = missionId === 4;

    setProgress((prev) => ({
      ...prev,
      completedMissions: newCompleted,
      missionAttempts: {
        ...prev.missionAttempts,
        [missionId]: attempts,
      },
      completedAt: isLast ? new Date().toISOString() : prev.completedAt,
    }));

    setSuccessModalData({
      isOpen: true,
      missionId,
      attempts,
    });
  };

  const handleNextMissionFromSuccess = () => {
    if (successModalData) {
      const nextId = successModalData.missionId + 1;
      setSuccessModalData(null);
      if (nextId <= 4) {
        setActiveMissionId(nextId);
        setCurrentScreen('STORY_DIALOGUE');
      } else {
        setCurrentScreen('ALL_COMPLETED');
      }
    }
  };

  const handleGoToCompletion = () => {
    setSuccessModalData(null);
    setCurrentScreen('ALL_COMPLETED');
  };

  const handleRestartAll = () => {
    const resetData: StudentProgress = {
      studentName: progress.studentName,
      currentMissionId: 1,
      completedMissions: [],
      missionAttempts: {},
      missionTimeSpent: {},
      consultationLocked: {},
      chatHistories: {},
      startedAt: new Date().toISOString(),
    };
    setProgress(resetData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    setActiveMissionId(1);
    setCurrentScreen('HOME');
  };

  return (
    <div className="min-h-screen relative text-[#3D2413] flex flex-col font-sans selection:bg-[#D9A441] selection:text-[#3D2413] overflow-x-hidden">
      {/* Peta Pencaharian Misi Nenek Kebayan - Universal Fixed Background */}
      <BackgroundMap />

      {/* Global Translucent Ambient Veil for Optimal Content Legibility */}
      <div className="fixed inset-0 bg-[#F4EDE2]/45 pointer-events-none z-0 backdrop-blur-[1px]" />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fair-play Focus Loss Detection & Gentle Chime */}
        <FocusLostAlert
          activeScreen={currentScreen}
          onFocusChange={(isFocused) => setIsTabPaused(!isFocused)}
        />

        {/* Top Application Navbar */}
        <Navbar
          studentName={progress.studentName}
          completedMissionsCount={progress.completedMissions.length}
          onOpenRecipeBook={() => setIsRecipeBookOpen(true)}
          onGoHome={() => setCurrentScreen('HOME')}
          showHomeButton={currentScreen !== 'HOME'}
        />

        {/* Main Screen Content */}
        <main className="flex-1 pb-12">
        {currentScreen === 'HOME' && (
          <HomeScreen
            progress={progress}
            onUpdateName={handleUpdateName}
            onSelectMission={handleSelectMission}
            onOpenRecipeBook={() => setIsRecipeBookOpen(true)}
            onOpenCompletionSummary={() => setCurrentScreen('ALL_COMPLETED')}
          />
        )}

        {currentScreen === 'STORY_DIALOGUE' && (
          <StoryDialogueScreen
            mission={activeMission}
            progress={progress}
            onProceedToExperiment={handleProceedToExperiment}
            onUpdateChatHistory={handleUpdateChatHistory}
            onBackToHome={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'AI_CONSULTATION' && (
          <AIConsultationScreen
            mission={activeMission}
            progress={progress}
            onProceedToExperiment={handleProceedToExperiment}
            onUpdateChatHistory={handleUpdateChatHistory}
            onBackToStory={() => setCurrentScreen('STORY_DIALOGUE')}
          />
        )}

        {currentScreen === 'EXPERIMENT' && (
          <ExperimentScreen
            mission={activeMission}
            progress={progress}
            isPausedByTab={isTabPaused}
            onUpdateAttempts={handleUpdateAttempts}
            onMissionSuccess={handleMissionSuccess}
            onBackToHome={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'ALL_COMPLETED' && (
          <CompletionScreen
            progress={progress}
            onRestartAll={handleRestartAll}
            onGoHome={() => setCurrentScreen('HOME')}
          />
        )}
      </main>

      {/* Mission Success Modal (Layar 5 notification) */}
      {successModalData?.isOpen && (
        <MissionSuccessModal
          mission={MISSIONS.find((m) => m.id === successModalData.missionId) || activeMission}
          fragment={
            STORY_FRAGMENTS.find((f) => f.missionId === successModalData.missionId) ||
            STORY_FRAGMENTS[0]
          }
          attempts={successModalData.attempts}
          isLastMission={successModalData.missionId === 4}
          onOpenRecipeBook={() => {
            setSuccessModalData(null);
            setIsRecipeBookOpen(true);
          }}
          onNextMission={handleNextMissionFromSuccess}
          onGoToCompletion={handleGoToCompletion}
        />
      )}

      {/* Recipe Book Jurnal Modal */}
      <RecipeBookModal
        isOpen={isRecipeBookOpen}
        progress={progress}
        onClose={() => setIsRecipeBookOpen(false)}
      />
      </div>
    </div>
  );
}
