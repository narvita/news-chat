import { PROMPT_POOL } from "../lib/constants/prompts";

export function getRandomPrompts() {
  const shuffled = [...PROMPT_POOL].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 3);
}
