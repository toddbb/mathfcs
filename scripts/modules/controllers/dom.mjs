/**
 * METHOD: DOM Module
 * Handles DOM manipulations and queries
 */
const Dom = {
   Views: {},

   init() {
      this.Views.home = document.querySelector(".view-home");
      this.Views.game = document.querySelector(".view-game");
      this.iconHome = document.querySelector(".icon-home");
      this.levelDisplay = document.querySelector(".level-display");
      this.levelDisplayValue = document.querySelector(".level-display-value");
      this.scoreDisplay = document.querySelector(".score-display");
      this.btnDifficulty = document.querySelectorAll(".btn-difficulty");
      this.question = document.querySelector(".question");
      this.btnChoices = document.querySelectorAll(".btn-choice");
      this.scoreDisplay = document.querySelector(".score-display");
      this.successOverlay = document.querySelector(".success-overlay");
      this.incorrectOverlay = document.querySelector(".incorrect-overlay");
   },
};

export default Dom;
