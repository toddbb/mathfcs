import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";

/**
 * METHOD: UI Module
 * Handles UI interactions and updates
 */
const Ui = {
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
      return new Promise((resolve) => {
         // Utils.log(`Switching to view: ${viewName}`, Utils.ENUM.LOG.INFO);
         Ui.hideAllViews().then(() => {
            Utils.show(Dom.Views[viewName]);
            resolve(true);
         });
      });
   },

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

   showIncorrectOverlay() {
      return new Promise((resolve) => {
         //Utils.log("Showing incorrect overlay", Utils.ENUM.LOG.INFO);
         // Show the overlay
         Utils.show(Dom.incorrectOverlay);
         // Hide it after the animation completes (2s)
         setTimeout(() => {
            Utils.hide(Dom.incorrectOverlay);
            resolve(true);
         }, 2000);
      });
   },

   showSuccessOverlay() {
      return new Promise((resolve) => {
         // Utils.log("Showing success overlay", Utils.ENUM.LOG.INFO);

         // Show the overlay
         Utils.show(Dom.successOverlay);

         // Hide it after the animation completes (1.5s)
         setTimeout(() => {
            Utils.hide(Dom.successOverlay);
            resolve(true);
         }, 750);
      });
   },
};

export default Ui;
