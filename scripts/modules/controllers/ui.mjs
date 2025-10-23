import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./game.mjs";
import modalSummary from "./modalSummary.mjs";
import User from "./user.mjs";

/**
 * METHOD: UI Module
 * Handles UI interactions and updates
 */
const Ui = {
   // Track currently open modal
   currentModal: null,

   // Handle browser back button
   handleBackButton(e) {
      // Check if we're in a modal state
      const state = e.state;
      const isModalState = state && state.modal;

      // If we have a modal open but the history state doesn't indicate a modal,
      // it means the user pressed back to close the modal
      if (this.currentModal && !isModalState) {
         const modalToClose = this.currentModal;
         this.closeModal(modalToClose);
         return;
      }

      // If the state indicates a modal should be open but we don't have one open,
      // open it (this handles forward navigation) - don't add to history since we're restoring
      if (isModalState && !this.currentModal) {
         this.showModal(state.modal, false);
         return;
      }
   },

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
      if (!Game.state.isRunning && viewName === "game") {
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
         Dom.levelDisplayValue.textContent = `${Game.state.difficulty}`;
         Utils.show(Dom.levelDisplay);
      } else {
         Utils.hide(Dom.levelDisplay);
      }
   },

   updateScoreDisplay() {
      Dom.scoreDisplay.textContent = User.Stats.get().score;
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
   showModal(modalName, addToHistory = true) {
      // If already showing this modal, don't do anything
      if (this.currentModal === modalName) return;

      // Close any existing modal first
      if (this.currentModal) {
         this.closeModal(this.currentModal);
      }

      // Set current modal
      this.currentModal = modalName;

      // Add history state for back button handling (unless we're restoring from history)
      if (addToHistory) {
         history.pushState({ modal: modalName }, "", window.location.href);
      }

      switch (modalName) {
         case "summary":
            Utils.show(Dom.modalSummary);
            // disable background scrolling, clicking, and focus
            this.disableBackgroundInteraction(true);
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }
   },

   closeModal(modalName) {
      // Only close if this is the currently open modal
      if (this.currentModal !== modalName) return;

      switch (modalName) {
         case "summary":
            Utils.hide(Dom.modalSummary);
            modalSummary.cleanup(); // Clean up charts and event listeners
            this.disableBackgroundInteraction(false);
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }

      // Clear current modal
      this.currentModal = null;
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

   // Initialize UI event listeners
   init() {
      Utils.log("Initializing UI Module", Utils.ENUM.LOG.INIT);
      this.updateScoreDisplay(User.state.user?.score || 0);
   },
};

export default Ui;
