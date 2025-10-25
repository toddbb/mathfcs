// import router from "../services/routing.mjs";
import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";
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

      // Header: User Avatar Click
      Dom.userAvatar.addEventListener("click", () => {
         Ui.handleAvatarClick();
      });

      // Header: Summary Button Click
      Dom.btnSummary.addEventListener("click", () => {
         Ui.handleBtnSummaryClick();
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

      // Modal User: Add User
      Dom.userAddUser.addEventListener("click", () => {
         modalUser.Handlers.handleUserAddClick();
      });

      // Modal User: Edit Save
      Dom.userEditBtnSave.addEventListener("click", () => {
         modalUser.Handlers.handleUserEditSave();
      });

      // Modal User: Edit Cancel
      Dom.userEditBtnCancel.addEventListener("click", () => {
         modalUser.Handlers.handleUserEditCancel();
      });

      // Modals: Close Buttons
      Dom.btnClose.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            Ui.handleBtnCloseClick(e.target);
         });
      });
   },
};

export default Events;
