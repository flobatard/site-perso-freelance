import { ComponentType } from "react";
import BetaOrderCapture from "./BetaOrderCapture";
import VolleyTeamOptimizer from "./VolleyTeamOptimizer";
import GuillaumeGalland from "./GuillaumeGalland";

const projectContents: Record<string, ComponentType> = {
  beta_order_capture: BetaOrderCapture,
  volley_team_optimizer: VolleyTeamOptimizer,
  guillaume_galland: GuillaumeGalland,
};

export default projectContents;
