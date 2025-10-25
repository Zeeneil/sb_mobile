import { memo, useCallback, useMemo, useRef } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { doSetSaveProgressBigkas } from "../../api/functions";
import { useAuth } from "../../hooks/authContext";
import useBigkasState from "./useBigkasState";
import useFuzzyMatching from "../../hooks/useFuzzyMatching";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useTimer from "../Timer/useTimer";
import GameSidebar from "./GameSidebar";
import Blackboard from "./Blackboard";
import ScorePanel from "./ScorePanel";
import BigkasModal from "../modals/modal4All";
import { useRouter } from "expo-router";
import { useBigkasContext } from "@/hooks/bigkasContext";
import { StatusBar } from "expo-status-bar";
import useAudioQueue from "../../hooks/useAudioQueue";
import { buildJobsFromText, CreateAudioForJob } from "@/utils/helpers";
import { useLogRegContext } from "@/hooks/logRegContext";
import { Toast } from "toastify-react-native";

const PlayBigkas = memo(() => {
  const router = useRouter();
  const { selectedModePhrases, setBigkasResults } = useBigkasContext();
  const { setIcon } = useLogRegContext();
  const { progressId, id, levelNumber, mode, modePhrases, resetProgress } = selectedModePhrases || {};
  const { currentUser, role } = useAuth();
  const maxTime = useMemo(() => 
    mode === "easy" ? 60 : mode === "normal" ? 45 : 30,
    [mode]
  );
  const { 
    state, 
    updateState, 
    resetForNewPhrase, 
    updatePhraseScore, 
    decrementTimer, 
    getCurrentPhrases, 
    userTotalPoints, 
    userTotalWords 
  } = useBigkasState(modePhrases?.phrases, maxTime, resetProgress);
  const { normalize, matchWords } = useFuzzyMatching(mode);
  const stopListeningRef = useRef<(() => void) | null>(null);
  const currentPhrase = useMemo(() => 
    state.phrases?.[state.currentPhraseIndex],
    [state.phrases, state.currentPhraseIndex]
  );
  const audioQueue = useAudioQueue(CreateAudioForJob);

  // Save progress function
  const saveProgress = useCallback(async () => {
    if (role !== "Student") return;
    try {
      const currentPhrases = getCurrentPhrases();
      const latestTotalPoints = currentPhrases.reduce((sum, p) => sum + (p.userPoints || 0), 0);
      const latestTotalWords = currentPhrases.reduce((sum, p) => sum + (p.userWords || 0), 0);
      await doSetSaveProgressBigkas(
        currentUser?.uid || "", 
        id, 
        progressId, 
        levelNumber, 
        mode, 
        currentPhrases, 
        latestTotalPoints, 
        latestTotalWords, 
        modePhrases.totalWords
      );
      setBigkasResults({
        bigkasId: id,
        userTotalPoints: latestTotalPoints,
        levelNumber: parseInt(levelNumber),
        mode,
      });
      router.replace(`/bigkas/gameCompleted`);
    } catch (error) {
      setIcon('errorBox');
      Toast.show({
        type: ('custom' as any),
        text1: 'Save Failed',
        text2: 'Failed to save progress. Please try again.',
        autoHide: false,
        progressBarColor: '#8a3903',
      });
      router.replace(`/bigkas/levelSelection`);
    }
  }, [
    role, 
    currentUser?.uid, 
    id, 
    progressId, 
    levelNumber, 
    mode, 
    getCurrentPhrases, 
    userTotalPoints, 
    userTotalWords, 
    modePhrases?.totalWords
  ]);
  
  // Handle exit with progress save
  const handleExitWithSave = useCallback(async () => {
    await saveProgress();
    router.replace(`/bigkas/levelSelection`);
  }, [saveProgress, router]);

  // Handle next phrase
  const handleNextPhrase = useCallback(async () => {
    if (state.currentPhraseIndex < state.phrases?.length - 1) {
      resetForNewPhrase(state.currentPhraseIndex + 1);
    } else {
      updateState({ phraseCompleted: true });
      await saveProgress();
    }
  }, [state.currentPhraseIndex, state.phrases?.length, resetForNewPhrase, updateState, saveProgress]);

  // Handle timer timeout
  const handleTimerTimeout = useCallback(() => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
    }
    const correctWordsCount = state.wordResults.filter(Boolean).length;
    updateState({ 
      isActive: false, 
      phraseCompleted: true, 
      showPopup: correctWordsCount > 0
    });
    if (correctWordsCount > 0) {
      updatePhraseScore(state.currentPhraseIndex, correctWordsCount, modePhrases.basePoints);
      setTimeout(() => {
        updateState({ showPopup: false });
        handleNextPhrase();
      }, 2000);
    } else {
      setTimeout(() => {
        handleNextPhrase();
      }, 1000);
    }
  }, [state.wordResults, state.currentPhraseIndex, updateState, updatePhraseScore, modePhrases?.basePoints, handleNextPhrase]);

  // Handle phrase completion
  const handlePhraseComplete = useCallback((correctWordsCount: number) => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
    }
    updateState({ 
      isActive: false, 
      phraseCompleted: true, 
      showPopup: true,
    });
    updatePhraseScore(state.currentPhraseIndex, correctWordsCount, modePhrases.basePoints);
    setTimeout(() => {
      updateState({ showPopup: false });
      handleNextPhrase();
    }, 2000);
  }, [updateState, updatePhraseScore, state.currentPhraseIndex, modePhrases?.basePoints, handleNextPhrase]);

  // Handle speech recognition result
  const handleSpeechResult = useCallback((transcript: string) => {
    if (state.phraseCompleted || state.paused) return;
    const userWords = normalize(transcript).split(/\s+/);
    const targetWords = normalize(currentPhrase.text).split(/\s+/);
    const matched = matchWords(userWords, targetWords);
    const mergedResults = matched.map((val, idx) => {
      if (state.wordResults[idx] === true) return true;
      return val;
    });
    updateState({ wordResults: mergedResults });
    if (mergedResults.every(Boolean) && mergedResults.length === targetWords.length) {
      handlePhraseComplete(mergedResults.filter(Boolean).length);
    }
  }, [state.phraseCompleted, state.paused, currentPhrase?.text, normalize, matchWords, updateState, handlePhraseComplete, state.wordResults]);

  const { startListening, stopListening } = useSpeechRecognition({ onResult: handleSpeechResult, isActive: state.isActive, updateState });
  stopListeningRef.current = stopListening;

  useTimer({
    timer: state.timer,
    isActive: !state.paused && !state.phraseCompleted,
    onTick: decrementTimer,
    onTimeout: handleTimerTimeout,
  });
  const handlePause = useCallback(() => {
    stopListening();
    updateState({ paused: true, isActive: false });
  }, [stopListening, updateState]);
  const handleResume = useCallback(() => {
    stopListening();
    updateState({ paused: false, isActive: false });
  }, [stopListening, updateState]);
  const handleStartListening = useCallback(() => {
    updateState({ isActive: true });
    startListening();
  }, [updateState, startListening]);

  const handleSpeak = useCallback(async (speed: "normal" | "slow") => {
    if (!currentPhrase?.text.trim()) { updateState({ showSpeed: false }); return; }
    await audioQueue.stop();
    const jobs = buildJobsFromText(currentPhrase.text, speed === "slow" ? 0.7 : 1.0);
    await audioQueue.playQueue(jobs);
    updateState({ showSpeed: false });
  }, [currentPhrase?.text, audioQueue, updateState]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <GameSidebar 
        timer={state.timer}
        maxTime={maxTime}
        currentPhrase={state.currentPhraseIndex + 1}
        totalPhrases={state.phrases?.length}
        paused={state.paused}
        onPause={handlePause}
        onResume={handleResume}
      />
      <Blackboard 
        phrase={currentPhrase}
        wordResults={state.wordResults}
        isActive={state.isActive}
        onListen={handleStartListening}
        showSpeed={state.showSpeed}
        updateState={updateState}
        onSpeak={handleSpeak}
        audioQueue={audioQueue}
      />
      <ScorePanel 
        mode={mode}
        phrases={state.phrases}
        totalPoints={modePhrases?.totalPoints}
        totalWords={modePhrases?.totalWords}
        showPopup={state.showPopup}
        isActive={state.isActive}
        userTotalPoints={userTotalPoints}
        userTotalWords={userTotalWords}
      />
      {state.paused && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 20 }}>
          <BigkasModal 
            type="pause" 
            isExiting={state.isExiting} 
            isOpen={state.paused} 
            onClose={handleResume} 
            onExitWithSave={handleExitWithSave} 
          />
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFA600',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completedRoot: {
    flexGrow: 1,
    backgroundColor: "#208ec5",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completedContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  completedHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  completedScore: {
    fontSize: 24,
    color: "#FFF9C4",
    fontWeight: "bold",
  },
  completedFooter: {
    alignItems: "center",
    marginTop: 24,
  },
  completedBackButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  completedBackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PlayBigkas;