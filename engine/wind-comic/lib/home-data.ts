import {
  IMG_LENS_BOX, IMG_RHYTHM, IMG_STYLE_GRID,
  IMG_AGENT_DIRECTOR, IMG_AGENT_STORYBOARD, IMG_AGENT_MOTION, IMG_AGENT_EDITOR,
  IMG_VIBE_FOREST, IMG_VIBE_NEON,
} from './placeholder-images';
import { getTranslations, type Locale } from './i18n';

const featureImages = [IMG_LENS_BOX, IMG_RHYTHM, IMG_STYLE_GRID];
const agentImages = [IMG_AGENT_DIRECTOR, IMG_AGENT_STORYBOARD, IMG_AGENT_MOTION, IMG_AGENT_EDITOR];
const vibeImages = [IMG_VIBE_FOREST, IMG_VIBE_NEON];

export function getHomeData(locale: Locale = 'zh-CN') {
  const t = getTranslations(locale).homeData;
  return {
    heroStats: t.heroStats,
    featureHighlights: t.featureHighlights.map((f, i) => ({ ...f, image: featureImages[i] })),
    agentCards: t.agentCards.map((a, i) => ({ ...a, image: agentImages[i] })),
    vibeShots: t.vibeShots.map((v, i) => ({ ...v, image: vibeImages[i] })),
  };
}

// compat con tests/home-data.test.ts
export const heroStats = getHomeData().heroStats;
export const featureHighlights = getHomeData().featureHighlights;
export const agentCards = getHomeData().agentCards;
export const vibeShots = getHomeData().vibeShots;
