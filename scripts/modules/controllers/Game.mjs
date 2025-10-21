import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import MathModule from "./maths.mjs";
import Ui from "./ui.mjs";
import User from "./user.mjs";

/**
 * METHOD: Game Module
 * Handles game logic and state
 */
const Game = {
   difficulty: null,
   isRunning: false,
   questionData: {},

   checkAnswer(selectedChoice) {
      let keyCorrectOrIncorrect = null;
      // Utils.log(`User selected choice: ${selectedChoice}`, Utils.ENUM.LOG.INFO);
      if (parseInt(selectedChoice) === this.questionData.correctAnswerIndex) {
         // Utils.log("User selected the correct answer!", Utils.ENUM.LOG.INFO);
         User.user.score += 1;
         // Show success overlay animation
         Ui.updateScoreDisplay(User.user.score);
         User.updateStats(true, this.questionData.operation, this.difficulty);
         Ui.showSuccessOverlay().then(() => {
            this.next();
         });
      } else {
         // Utils.log("User selected the wrong answer.", Utils.ENUM.LOG.INFO);
         User.updateStats(false, this.questionData.operation, this.difficulty);
         // Show incorrect overlay animation and do not proceed to next question
         Ui.showIncorrectOverlay().then(() => {});
      }
   },

   insertQuestion(question) {
      // Replace "*" with "x" for display purposes only and replace "/" with "÷"
      const displayQuestion = question.replace(/\*/g, "x").replace(/\//g, "÷");
      Dom.question.textContent = displayQuestion;
   },

   populateChoices(choices) {
      Dom.btnChoices.forEach((btn, index) => {
         btn.textContent = choices[index];
      });
   },

   async next() {
      this.questionData = await MathModule.generateData(this.difficulty);
      // Utils.log(`Next question generated: ${this.questionData.question}`, Utils.ENUM.LOG.INFO);
      // Utils.log(`Choices: ${nextData.choices}`, Utils.ENUM.LOG.INFO);
      this.insertQuestion(this.questionData.question);
      this.populateChoices(this.questionData.choices);
   },

   setDifficulty(difficulty) {
      this.difficulty = difficulty;
   },

   reset() {
      Ui.updateScoreDisplay(User.user.score);
      this.insertQuestion("");
      this.populateChoices([]);
      this.isRunning = true;
   },

   async init() {
      Utils.log("Initializing Game Module", Utils.ENUM.LOG.INIT);
      // load the user info from local storage
      Game.reset();
      await Game.next();
   },
};

export default Game;
