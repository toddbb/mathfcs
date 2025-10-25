import { navigate } from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";
import modalSummary from "./modalSummary.mjs";
import modalUser from "./modalUser.mjs";
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

   // Handle summary button click to show summary modal
   handleBtnSummaryClick() {
      Ui.showModal("summary");
      // Only init once, then refresh for subsequent opens
      if (!modalSummary._eventsInitialized) {
         modalSummary.init();
      } else {
         modalSummary.refresh();
      }
   },

   // Handle user avatar click to change avatar
   handleAvatarClick() {
      Utils.log("User avatar clicked. Opening User Modal.", "👤");
      Utils.show(Dom.modalUser);
      Ui.showModal("user");
   },

   // Close Button (for modals)
   handleBtnCloseClick(target) {
      const divEl = target.closest(".modal-close");
      const modalName = divEl.dataset.close;
      this.closeModal(modalName);
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
            Utils.removeClass(Dom.modalSummary, "modal-disable");
            Utils.show(Dom.modalSummary);
            modalSummary.init();
            break;
         case "user":
            Utils.removeClass(Dom.modalUser, "modal-disable");
            Utils.show(Dom.modalUser);
            modalUser.init();
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }

      this.disableBackgroundInteraction(true);
      this.disableHeaderInteraction(true);
   },

   closeModal(modalName) {
      // Only close if this is the currently open modal
      if (this.currentModal !== modalName) return;

      switch (modalName) {
         case "summary":
            Utils.hide(Dom.modalSummary);
            modalSummary.cleanup(); // Clean up charts and event listeners
            Utils.addClass(Dom.modalSummary, "modal-disable");
            break;
         case "user":
            Utils.hide(Dom.modalUser);
            Utils.addClass(Dom.modalUser, "modal-disable");
            break;
         default:
            Utils.log(`Unknown modal: ${modalName}`, Utils.ENUM.LOG.WARN);
      }

      this.disableBackgroundInteraction(false);
      this.disableHeaderInteraction(false);

      // Clear current modal
      this.currentModal = null;
   },

   updateUserContainer() {
      ///   Update user avatar and name in header
      console.log("Updating user container in header:", User.state.user);
      if (User.state.user) {
         Dom.userName.textContent = User.state.user.name;
         Dom.userAvatar.src = `assets/avatars/avatar-${User.state.user.avatarId}.jpg`;
      } else {
         Dom.userName.textContent = "Guest";
         Dom.userAvatar.src = `assets/avatars/avatar-0.jpg`;
      }
   },

   disableHeaderInteraction(disable = false) {
      if (disable) {
         Dom.header.style.pointerEvents = "none";
         Utils.addClass(Dom.header, "hidden");
      } else {
         Dom.header.style.pointerEvents = "";
         Utils.removeClass(Dom.header, "hidden");
      }
   },

   disableBackgroundInteraction(disable = false) {
      if (disable) {
         // document.body.style.overflow = "hidden"; // Disable scrolling
         Dom.Views.home.style.pointerEvents = "none"; // Disable clicking
         Dom.Views.game.style.pointerEvents = "none"; // Disable clicking
         Utils.addClass(Dom.Views.home, "hidden");
         Utils.addClass(Dom.Views.game, "hidden");
      } else {
         // document.body.style.overflow = ""; // Enable scrolling
         Dom.Views.home.style.pointerEvents = ""; // Enable clicking
         Dom.Views.game.style.pointerEvents = ""; // Enable clicking
         Utils.removeClass(Dom.Views.home, "hidden");
         Utils.removeClass(Dom.Views.game, "hidden");
      }
   },

   // Initialize UI event listeners
   init() {
      Utils.log("Initializing UI Module", Utils.ENUM.LOG.INIT);
      this.updateUserContainer(User.state.user);
      this.updateScoreDisplay(User.state.user?.score || 0);
   },
};

export default Ui;
