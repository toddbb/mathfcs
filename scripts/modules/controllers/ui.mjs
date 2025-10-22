import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";

/**
 * METHOD: UI Module
 * Handles UI interactions and updates
 */
const Ui = {
   /// Event handlers
   handleDifficultyLevelClick(e) {
      const selectedDifficulty = e.target.closest(".btn-difficulty").dataset.difficulty;
      Game.setDifficulty(selectedDifficulty);
      Game.init();
      this.showLevelDisplay(true);
      navigate("game");
   },

   /// View Management
   hideAllViews() {
      return new Promise((resolve) => {
         // Utils.log(`Hiding all views`, Utils.ENUM.LOG.INFO);
         Object.values(Dom.Views).forEach((view) => {
            Utils.hide(view);
         });
         resolve(true);
      });
   },

   showView(viewName) {
      // Prevent access to game if the game is not running
      if (!Game.isRunning && viewName === "game") {
         window.location.hash = "home";
         return Promise.resolve(false);
      }

      return new Promise((resolve) => {
         // Utils.log(`Switching to view: ${viewName}`, Utils.ENUM.LOG.INFO);
         Ui.hideAllViews().then(() => {
            Utils.show(Dom.Views[viewName]);
            resolve(true);
         });
      });
   },

   /// Header Info
   showLevelDisplay(isShow) {
      if (isShow) {
         Dom.levelDisplayValue.textContent = `${Game.difficulty}`;
         Utils.show(Dom.levelDisplay);
      } else {
         Utils.hide(Dom.levelDisplay);
      }
   },

   updateScoreDisplay(newScore) {
      Dom.scoreDisplay.textContent = newScore;
   },

   /// Overlay Management
   showIncorrectAnimation() {
      return new Promise((resolve) => {
         //Utils.log("Showing incorrect overlay", Utils.ENUM.LOG.INFO);
         // Show the overlay & animation
         Utils.show(Dom.incorrectOverlay);
         Utils.show(Dom.incorrectAnimation);
         // Hide it after the animation completes (2s)
         setTimeout(() => {
            Utils.hide(Dom.incorrectOverlay);
            Utils.hide(Dom.incorrectAnimation);
            resolve(true);
         }, 1500);
      });
   },

   showSuccessAnimation() {
      return new Promise((resolve) => {
         // Utils.log("Showing success overlay", Utils.ENUM.LOG.INFO);

         // Show the overlay & animation
         Utils.show(Dom.successOverlay);
         Utils.show(Dom.successAnimation);

         // Hide it after the animation completes (1.5s)
         setTimeout(() => {
            Utils.hide(Dom.successOverlay);
            Utils.hide(Dom.successAnimation);
            resolve(true);
         }, 750);
      });
   },

   /// Modal Management
   showModal(modalName) {
      switch (modalName) {
         case "summary":
            Utils.show(Dom.modalSummary);
            // disable background scrolling, clicking, and focus
            Ui.disableBackgroundInteraction(true);
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }
   },

   closeModal(modalName) {
      switch (modalName) {
         case "summary":
            Utils.hide(Dom.modalSummary);
            Ui.disableBackgroundInteraction(false);
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }
   },

   disableBackgroundInteraction(disable = false) {
      if (disable) {
         // document.body.style.overflow = "hidden"; // Disable scrolling
         Dom.Views.home.style.pointerEvents = "none"; // Disable clicking
         Dom.Views.game.style.pointerEvents = "none"; // Disable clicking
      } else {
         // document.body.style.overflow = ""; // Enable scrolling
         Dom.Views.home.style.pointerEvents = ""; // Enable clicking
         Dom.Views.game.style.pointerEvents = ""; // Enable clicking
      }
   },
};

export default Ui;
