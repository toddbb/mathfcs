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
      this.header = document.querySelector("header");
      this.iconHome = document.querySelector(".btnHome");
      this.levelDisplay = document.querySelector(".level-display");
      this.levelDisplayValue = document.querySelector(".level-display-value");
      this.scoreDisplay = document.querySelector(".score-display");
      this.btnSummary = document.querySelector(".btnSummary");
      this.userName = document.querySelector(".user-name");
      this.userAvatar = document.querySelector(".user-avatar");

      /// Game Elements
      this.btnDifficulty = document.querySelectorAll(".btn-difficulty");
      this.question = document.querySelector(".question");
      this.btnChoices = document.querySelectorAll(".btn-choice");
      this.scoreDisplay = document.querySelector(".score-display");
      this.successOverlay = document.querySelector(".success-overlay");
      this.successAnimation = document.querySelector(".success-animation");
      this.incorrectOverlay = document.querySelector(".incorrect-overlay");
      this.incorrectAnimation = document.querySelector(".incorrect-animation");

      /// Modal: All
      this.btnClose = document.querySelectorAll(".modal-close");

      /// Modal: Summary Elements
      this.modalSummary = document.querySelector(".modal-summary");
      this.allStats = document.querySelectorAll(".stats-main-stat-value");
      this.chartSelector = document.querySelector(".chart-selector");
      this.allChartSelectors = document.querySelectorAll(".chart-btn");
      this.chartContainer = document.querySelector(".chart-container");

      /// Modal: User Elements
      this.modalUser = document.querySelector(".modal-user");
      this.modalUserWrapper = document.querySelector(".modal-user .modal-wrapper");
      this.userListContainer = document.querySelector(".user-select-container");
      this.userAddUser = document.querySelector(".user-add");
      this.userEditContainer = document.querySelector(".modal-user-edit");
      this.userEditAvatarContainer = document.querySelector(".avatar-list");
      this.userEditNameInput = document.querySelector(".user-name-edit");
      this.userEditBtnSave = document.querySelector(".user-edit-save");
      this.userEditBtnCancel = document.querySelector(".user-edit-cancel");
   },
};

export default Dom;
