import { ComponentType } from "react";
import BetaOrderCapture from "./BetaOrderCapture";
import VolleyTeamOptimizer from "./VolleyTeamOptimizer";
import GuillaumeGalland from "./GuillaumeGalland";
import WritingAIssistant from "./WritingAIssistant";

const projectContents: Record<string, ComponentType> = {
  beta_order_capture: BetaOrderCapture,
  volley_team_optimizer: VolleyTeamOptimizer,
  guillaume_galland: GuillaumeGalland,
  writing_assistant: WritingAIssistant,
};

export default projectContents;
