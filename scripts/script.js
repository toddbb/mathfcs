import { Config } from "./modules/config/config.mjs";
import AppStorage from "./modules/services/storageService.mjs";
import * as Utils from "./modules/utilities/utils.mjs";

/**
 * METHOD: DOM Module
 * Handles DOM manipulations and queries
 */
const Dom = {
   Views: {},

   init() {
      this.Views.start = document.querySelector(".view-start");
      this.Views.game = document.querySelector(".view-game");
      this.btnReset = document.querySelector(".btn-reset");
      this.btnStart = document.querySelector(".btn-start");
      this.question = document.querySelector(".question");
      this.btnChoices = document.querySelectorAll(".btn-choice");
      this.scoreDisplay = document.querySelector(".score-display");
      this.successOverlay = document.querySelector(".success-overlay");
   },
};

/**
 * METHOD: Events Module
 * Handles event binding and delegation
 */
const Events = {
   init() {
      Utils.log("Initializing Events Module", Utils.ENUM.LOG.INIT);
      Dom.btnStart.addEventListener("click", async () => {
         const viewLoaded = await Ui.showView("game");
         if (viewLoaded) {
            await Game.init();
         }
      });

      Dom.btnReset.addEventListener("click", () => {
         User.reset();
      });

      Dom.btnChoices.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            const selectedChoice = e.target.dataset.choice;
            Game.checkAnswer(selectedChoice);
         });
      });
   },
};

/**
 * METHOD: UI Module
 * Handles UI interactions and updates
 */
const Ui = {
   hideAllViews() {
      return new Promise((resolve) => {
         Utils.log(`Hiding all views`, Utils.ENUM.LOG.INFO);
         Object.values(Dom.Views).forEach((view) => {
            Utils.hide(view);
         });
         resolve(true);
      });
   },

   showView(viewName) {
      return new Promise((resolve) => {
         Utils.log(`Switching to view: ${viewName}`, Utils.ENUM.LOG.INFO);
         Ui.hideAllViews().then(() => {
            Utils.show(Dom.Views[viewName]);
            resolve(true);
         });
      });
   },

   updateScoreDisplay(newScore) {
      Dom.scoreDisplay.textContent = newScore;
   },

   showSuccessOverlay() {
      return new Promise((resolve) => {
         Utils.log("Showing success overlay", Utils.ENUM.LOG.INFO);

         // Show the overlay
         Utils.show(Dom.successOverlay);

         // Hide it after the animation completes (1.5s)
         setTimeout(() => {
            Utils.hide(Dom.successOverlay);
            resolve(true);
         }, 1500);
      });
   },
};

/**
 * METHOD: User Module
 * Handles user data and interactions
 */
const User = {
   user: {
      name: null,
      score: 0,
   },

   // Create a debounced version of the save function
   debouncedSet: null,

   set() {
      // Initialize the debounced function if it doesn't exist
      if (!this.debouncedSet) {
         this.debouncedSet = Utils.debounce(() => {
            AppStorage().local.set("user_data", this.user);
         }, 2000);
      }
      // Call the debounced function
      this.debouncedSet();
   },

   updateScore(points) {
      this.user.score += points;
      this.set();
      Ui.updateScoreDisplay(this.user.score);
   },

   reset() {
      this.user = { name: "Guest", score: 0 };
      this.set();
      Ui.updateScoreDisplay(this.user.score);
   },

   init() {
      Utils.log("Initializing User Module", Utils.ENUM.LOG.INIT);
      // Use AppStorage consistently instead of direct localStorage access
      const userData = AppStorage().local.get("user_data");
      if (userData) {
         User.user = userData;
         Utils.log("User data loaded from storage", Utils.ENUM.LOG.INFO);
      } else {
         console.log("No user data found, initializing new user.");
         User.user = { name: "Guest", score: 0 };
         // Save the new user data immediately (not debounced for initial setup)
         User.set();
      }
      Ui.updateScoreDisplay(User.user.score);
   },
};

/**
 * METHOD: Game Module
 * Handles game logic and state
 */
const Game = {
   correctAnswerIndex: null,
   choices: [],

   checkAnswer(selectedChoice) {
      Utils.log(`User selected choice: ${selectedChoice}`, Utils.ENUM.LOG.INFO);
      if (parseInt(selectedChoice) === this.correctAnswerIndex) {
         Utils.log("User selected the correct answer!", Utils.ENUM.LOG.INFO);
         User.updateScore(1);
         // Show success overlay animation
         Ui.showSuccessOverlay().then(() => {
            this.next();
         });
      } else {
         Utils.log("User selected the wrong answer.", Utils.ENUM.LOG.INFO);
         this.next();
      }
   },

   insertQuestion(question) {
      // Replace "*" with "x" for display purposes only
      const displayQuestion = question.replace(/\*/g, "x");
      Dom.question.textContent = displayQuestion;
   },

   populateChoices(choices) {
      Dom.btnChoices.forEach((btn, index) => {
         btn.textContent = choices[index];
      });
   },

   async next() {
      const nextData = await MathModule.generateData();
      const { question, choices, correctAnswerIndex } = nextData;
      // Utils.log(`Next question generated: ${nextData.question}`, Utils.ENUM.LOG.INFO);
      // Utils.log(`Choices: ${nextData.choices}`, Utils.ENUM.LOG.INFO);
      this.insertQuestion(question);
      this.populateChoices(choices);
      this.correctAnswerIndex = correctAnswerIndex;
   },

   reset() {
      Ui.updateScoreDisplay(User.user.score);
      this.insertQuestion("");
      this.populateChoices([]);
   },

   async init() {
      Utils.log("Initializing Game Module", Utils.ENUM.LOG.INIT);
      // load the user info from local storage
      Game.reset();
      await Game.next();
   },
};

/**
 * METHOD: Math Module
 * Handles math question generation and evaluation
 */
const MathModule = {
   question: "",
   choices: [],
   correctAnswer: null,
   correctAnswerIndex: null,

   async generateData() {
      this.question = await this._generateQuestion();
      this.correctAnswer = await this._calculateAnswer();
      this.choices = await this._generateChoices();
      this.correctAnswerIndex = this.choices.indexOf(this.correctAnswer);

      return {
         question: this.question,
         choices: this.choices,
         correctAnswerIndex: this.correctAnswerIndex,
      };
   },

   _getRandomOperator() {
      const operators = ["+", "-", "*"];
      const randomIndex = Utils.getRandomInclusive(0, operators.length - 1);
      return operators[randomIndex];
   },

   async _generateQuestion() {
      let num1 = Utils.getRandomInclusive(1, 10);
      let num2 = Utils.getRandomInclusive(1, 10);
      const operator = this._getRandomOperator();

      // For subtraction, ensure num1 is always >= num2 to avoid negative results
      if (operator === "-" && num1 < num2) {
         // Swap the numbers to ensure num1 >= num2
         [num1, num2] = [num2, num1];
      }

      const question = `${num1} ${operator} ${num2}`;
      console.log(`📖 Generated question: ${question}`);
      return question;
   },

   async _calculateAnswer() {
      const result = eval(this.question);
      console.log(`📖 Correct answer is: ${result}`);
      return result;
   },

   async _generateChoices() {
      const correctAnswer = this.correctAnswer;
      const choices = new Set();
      choices.add(correctAnswer);
      while (choices.size < 4) {
         const fakeAnswer = correctAnswer + Utils.getRandomInclusive(-10, 10);
         choices.add(fakeAnswer);
      }
      const allChoices = Array.from(choices).sort(() => Math.random() - 0.5);
      console.log(`📖 Generated choices: ${allChoices}`);
      return allChoices;
   },
};

/**
 * Function: init
 *
 * Initializes the DOM after it is loaded
 */
const initAfterDOM = () => {
   Utils.log("Initializing application after DOM load", Utils.ENUM.LOG.INIT);

   Dom.init();
   Events.init();
   User.init();

   if (Config.DEV_MODE) {
      import("./modules/utilities/debug.mjs").then(({ Debug }) => {
         Debug.init();
         window.Config = Config;
         window.Utils = Utils;
         window.Debug = Debug;
         window.Dom = Dom;
         window.Events = Events;
         window.Ui = Ui;
         window.Game = Game;
         window.User = User;
         window.AppStorage = AppStorage;
      });
   }
};

document.addEventListener("DOMContentLoaded", () => initAfterDOM());
