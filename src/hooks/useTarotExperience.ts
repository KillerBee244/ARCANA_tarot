"use client";

import { useReducer, useCallback } from "react";
import { ExperienceState, ExperienceAction, SceneState } from "@/types/scene";
import { QuestionCategory, SelectedCard, SpreadType } from "@/types/tarot";
import { shuffleDeck, getRandomOrientation } from "@/lib/tarot/deck";
import { interpretReadingRulebase } from "@/lib/tarot/engine";
import { getSpreadDef } from "@/data/tarot/spreads";
import { ReadingSessionRecord } from "@/types/reading";

function createInitialState(): ExperienceState {
  return {
    scene: "PORTAL",
    readingId: "arcana-session-initial",
    question: "",
    category: "general",
    spreadType: "three_card",
    allowReversed: true,
    shuffledDeck: [],
    selectedCards: [],
    revealIndex: 0,
    rulebaseResult: null,
    aiStatus: "idle",
    aiResult: null,
    aiError: null,
    isSoundEnabled: true,
    isReducedMotion: false,
  };
}

function tarotReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
  switch (action.type) {
    case "ENTER_QUESTION":
      return {
        ...state,
        scene: "QUESTION",
      };

    case "SET_QUESTION":
      return {
        ...state,
        question: action.question,
        category: action.category,
      };

    case "SET_SPREAD_TYPE":
      return {
        ...state,
        spreadType: action.spreadType,
      };

    case "SET_ALLOW_REVERSED":
      return {
        ...state,
        allowReversed: action.allowReversed,
      };

    case "PROCEED_TO_DECK":
      return {
        ...state,
        readingId: `arcana-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        scene: "DECK",
        shuffledDeck: action.shuffledDeck,
        selectedCards: [],
        rulebaseResult: null,
        aiStatus: "idle",
        aiResult: null,
        aiError: null,
      };

    case "SELECT_CARD": {
      const spreadDef = getSpreadDef(state.spreadType);
      if (state.selectedCards.length >= spreadDef.cardCount) {
        return state;
      }
      if (state.selectedCards.some((sc) => sc.cardId === action.cardId)) {
        return state;
      }
      const nextIndex = state.selectedCards.length;
      const position = spreadDef.positions[nextIndex];
      const newCard: SelectedCard = {
        cardId: action.cardId,
        orientation: action.orientation,
        positionId: position.id,
        selectionOrder: nextIndex,
      };

      return {
        ...state,
        selectedCards: [...state.selectedCards, newCard],
      };
    }

    case "DESELECT_CARD":
      return {
        ...state,
        selectedCards: state.selectedCards.filter((sc) => sc.cardId !== action.cardId),
      };

    case "START_REVEAL":
      return {
        ...state,
        scene: "REVEAL",
        revealIndex: 0,
      };

    case "COMPLETE_REVEAL":
      return {
        ...state,
        scene: "READING",
        rulebaseResult: action.rulebaseResult,
      };

    case "START_AI_REQUEST":
      return {
        ...state,
        aiStatus: "loading",
        aiError: null,
      };

    case "SET_AI_SUCCESS":
      return {
        ...state,
        aiStatus: "success",
        aiResult: action.result,
        aiError: null,
      };

    case "SET_AI_ERROR":
      return {
        ...state,
        aiStatus: action.status,
        aiError: action.message,
      };

    case "RESTART_READING":
      return {
        ...createInitialState(),
        scene: "QUESTION",
      };

    case "RESTORE_READING":
      return {
        ...state,
        scene: "READING",
        readingId: action.savedSession.readingId,
        question: action.savedSession.question,
        category: action.savedSession.category,
        spreadType: action.savedSession.spreadType,
        allowReversed: action.savedSession.allowReversed,
        selectedCards: action.savedSession.selectedCards,
        rulebaseResult: action.savedSession.rulebaseResult,
        aiStatus: action.savedSession.aiStatus,
        aiResult: action.savedSession.aiResult,
        aiError: action.savedSession.aiErrorMessage || null,
      };

    case "NAVIGATE_SCENE":
      return {
        ...state,
        scene: action.scene,
      };

    default:
      return state;
  }
}

export function useTarotExperience() {
  const [state, dispatch] = useReducer(tarotReducer, undefined, createInitialState);

  // Transitions
  const startPortal = useCallback(() => {
    dispatch({ type: "ENTER_QUESTION" });
  }, []);

  const proceedToDeck = useCallback(
    (question: string, category: QuestionCategory, spreadType: SpreadType, allowReversed: boolean) => {
      dispatch({ type: "SET_QUESTION", question, category });
      dispatch({ type: "SET_SPREAD_TYPE", spreadType });
      dispatch({ type: "SET_ALLOW_REVERSED", allowReversed });
      const freshDeck = shuffleDeck();
      dispatch({ type: "PROCEED_TO_DECK", shuffledDeck: freshDeck });
    },
    []
  );

  const selectCard = useCallback(
    (cardId: string) => {
      const orientation = getRandomOrientation(state.allowReversed);
      dispatch({ type: "SELECT_CARD", cardId, orientation });
    },
    [state.allowReversed]
  );

  const deselectCard = useCallback((cardId: string) => {
    dispatch({ type: "DESELECT_CARD", cardId });
  }, []);

  const proceedToReveal = useCallback(() => {
    dispatch({ type: "START_REVEAL" });
  }, []);

  const executeAiRequest = useCallback(
    async (
      readingId: string,
      question: string,
      category: QuestionCategory,
      spreadType: SpreadType,
      selectedCards: SelectedCard[]
    ) => {
      dispatch({ type: "START_AI_REQUEST" });
      try {
        const res = await fetch("/api/readings/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            readingId,
            question,
            category,
            spreadType,
            selectedCards,
          }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          dispatch({ type: "SET_AI_SUCCESS", result: json.data });
        } else {
          const code = json.error?.code || "UPSTREAM_ERROR";
          const status =
            code === "DISABLED" || code === "MISSING_KEY"
              ? "disabled"
              : code === "RATE_LIMITED"
              ? "rate_limited"
              : code === "TIMEOUT"
              ? "timeout"
              : "error";
          dispatch({
            type: "SET_AI_ERROR",
            status,
            message: json.error?.message || "Không thể tải diễn giải AI.",
          });
        }
      } catch (err: any) {
        dispatch({
          type: "SET_AI_ERROR",
          status: "error",
          message: "Lỗi kết nối tới máy chủ diễn giải AI.",
        });
      }
    },
    []
  );

  const completeReveal = useCallback(() => {
    // Generate Rulebase Interpretation synchronously (Phase A)
    const rulebase = interpretReadingRulebase(
      state.selectedCards,
      state.spreadType,
      state.category,
      state.question
    );

    dispatch({ type: "COMPLETE_REVEAL", rulebaseResult: rulebase });

    // Trigger AI Request asynchronously without blocking Rulebase (Phase B)
    executeAiRequest(
      state.readingId,
      state.question,
      state.category,
      state.spreadType,
      state.selectedCards
    );
  }, [state.selectedCards, state.spreadType, state.category, state.question, state.readingId, executeAiRequest]);

  const retryAI = useCallback(() => {
    executeAiRequest(
      state.readingId,
      state.question,
      state.category,
      state.spreadType,
      state.selectedCards
    );
  }, [state.readingId, state.question, state.category, state.spreadType, state.selectedCards, executeAiRequest]);

  const restartReading = useCallback(() => {
    dispatch({ type: "RESTART_READING" });
  }, []);

  const restoreReading = useCallback((record: ReadingSessionRecord) => {
    dispatch({ type: "RESTORE_READING", savedSession: record });
  }, []);

  const navigateScene = useCallback((scene: SceneState) => {
    dispatch({ type: "NAVIGATE_SCENE", scene });
  }, []);

  return {
    state,
    startPortal,
    proceedToDeck,
    selectCard,
    deselectCard,
    proceedToReveal,
    completeReveal,
    retryAI,
    restartReading,
    restoreReading,
    navigateScene,
  };
}

