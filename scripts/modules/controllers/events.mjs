// import router from "../services/routing.mjs";
import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./game.mjs";
import modalSummary from "./modalSummary.mjs";
import Ui from "./ui.mjs";

/**
 * METHOD: Events Module
 * Handles event binding and delegation
 */
const Events = {
   init() {
      Utils.log("Initializing Events Module", Utils.ENUM.LOG.INIT);

      // UI: Handle browser back button
      window.addEventListener("popstate", (e) => {
         Ui.handleBackButton(e);
      });

      // Header: Home Icon Click
      Dom.iconHome.addEventListener("click", () => {
         Ui.showLevelDisplay(false);
         Game.state.isRunning = false; // Reset game state
         navigate("home");
      });

      // Header: Summary Button Click
      Dom.btnSummary.addEventListener("click", () => {
         Ui.showModal("summary");
         // Only init once, then refresh for subsequent opens
         if (!modalSummary._eventsInitialized) {
            modalSummary.init();
         } else {
            modalSummary.refresh();
         }
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


      // Modal Summary: Chart Selector
      Dom.chartSelector.addEventListener("click", (e) => {
         // console.log("Chart selector clicked:", e.target);
         if (e.target.classList.contains("chart-btn")) {
            modalSummary.handleChartSelectorClick(e.target);
         }
      });

      Dom.btnClose.addEventListener("click", () => {
         Ui.closeModal("summary");
      });
   },
};

export default Events;
