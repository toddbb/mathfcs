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
      this.successAnimation = document.querySelector(".success-animation");
      this.incorrectOverlay = document.querySelector(".incorrect-overlay");
      this.incorrectAnimation = document.querySelector(".incorrect-animation");

      /// Modal: Summary Elements
      this.modalSummary = document.querySelector(".modal-summary");
      this.allStats = document.querySelectorAll(".stats-main-stat-value");
      this.chartSelector = document.querySelector(".chart-selector");
      this.allChartSelectors = document.querySelectorAll(".chart-btn");
      this.chartContainer = document.querySelector(".chart-container");
      this.btnClose = document.querySelector(".modal-close");
   },
};

export default Dom;
