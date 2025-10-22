/**
 * METHOD: DOM Module
 * Handles DOM manipulations and queries
 */
const Dom = {
   Views: {},

   init() {
      /// Views
      this.Views.home = document.querySelector(".view-home");
      this.Views.game = document.querySelector(".view-game");

      /// Header Elements
      this.iconHome = document.querySelector(".btnHome");
      this.levelDisplay = document.querySelector(".level-display");
      this.levelDisplayValue = document.querySelector(".level-display-value");
      this.scoreDisplay = document.querySelector(".score-display");
      this.btnSummary = document.querySelector(".btnSummary");

      /// Game Elements
      this.btnDifficulty = document.querySelectorAll(".btn-difficulty");
      this.question = document.querySelector(".question");
      this.btnChoices = document.querySelectorAll(".btn-choice");
      this.scoreDisplay = document.querySelector(".score-display");
      this.successOverlay = document.querySelector(".success-overlay");
      this.incorrectOverlay = document.querySelector(".incorrect-overlay");

      /// Summary Model and Elements
      this.modalSummary = document.querySelector(".modal-summary");
   },
};

export default Dom;
