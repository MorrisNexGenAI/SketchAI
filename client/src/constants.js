export const MODES = { PENCIL: "pencil", ART: "art" };

export const SUBJECTS = ["Biology", "Physics", "Chemistry", "Math", "Geography", "Other"];

export const MOODS = ["Excited", "Curious", "Stressed", "Neutral", "Frustrated"];

export const BACKGROUND_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gold", value: "#F59E0B" },
  { name: "Yellow", value: "#FBBF24" },
  { name: "Gray", value: "#6B7280" }
];

export const DEFAULT_BACKGROUND = "#FFFFFF";

export const EDUCATIONAL_TIPS = {
  Biology: "Focus on organ outlines for clarity.",
  Physics: "Emphasize forces and vectors.",
  Chemistry: "Clear bond lines and atom representations.",
  Math: "Emphasize axes and curves.",
  Geography: "Focus on boundary lines and terrain features.",
  Other: "Focus on key structural elements."
};

export const API_URL = import.meta.env.VITE_API_URL || "/api";
