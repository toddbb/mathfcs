// import router from "../services/routing.mjs";
import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";
import Ui from "./ui.mjs";
import modalSummary from "./modalSummary.mjs";

/**
 * METHOD: Events Module
 * Handles event binding and delegation
 */
const Events = {
   init() {
      Utils.log("Initializing Events Module", Utils.ENUM.LOG.INIT);      

      // Header: Home Icon Click
      Dom.iconHome.addEventListener("click", () => {
         Ui.showLevelDisplay(false);
         Game.isRunning = false; // Reset game state
         navigate("home");
      });

      // Header: Summary Button Click
      Dom.btnSummary.addEventListener("click", () => {
         Ui.showModal("summary");
         modalSummary.init();
      });

      // Home: Difficulty Level
      Dom.btnDifficulty.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            Ui.handleDifficultyLevelClick(e);
         });
      });

      // Game: Multiple Choice Buttons
      Dom.btnChoices.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            const selectedChoice = e.target.dataset.choice;
            Game.checkAnswer(selectedChoice);
         });
      });
   },
};

export default Events;
