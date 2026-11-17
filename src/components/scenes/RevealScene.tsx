"use client";

import React from "react";
import { CardReveal } from "@/components/tarot/CardReveal";
import { getCardById } from "@/data/tarot/cards";
import { getSpreadDef } from "@/data/tarot/spreads";
import { PopulatedCard, SelectedCard, SpreadType } from "@/types/tarot";

interface RevealSceneProps {
  spreadType: SpreadType;
  selectedCards: SelectedCard[];
  onCompleteReveal: () => void;
}

export const RevealScene: React.FC<RevealSceneProps> = ({
  spreadType,
  selectedCards,
  onCompleteReveal,
}) => {
  const spreadDef = getSpreadDef(spreadType);

  // Populate cards
  const populatedCards: PopulatedCard[] = selectedCards.map((sc, i) => {
    const cardData = getCardById(sc.cardId);
    if (!cardData) throw new Error(`Card not found: ${sc.cardId}`);
    const position =
      spreadDef.positions.find((p) => p.id === sc.positionId) ||
      spreadDef.positions[i] || {
        id: sc.positionId,
        nameVi: "Trọng tâm",
        nameEn: "Focus",
        descriptionVi: "Vị trí trọng tâm.",
      };

    return {
      ...sc,
      card: cardData,
      position,
    };
  });

  return (
    <div className="w-full">
      <CardReveal cards={populatedCards} onComplete={onCompleteReveal} />
    </div>
  );
};

