import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import MathModule from "./maths.mjs";
import Ui from "./ui.mjs";
import User from "./user.mjs";

/**
 * METHOD: game Module
 * Handles game logic and state
 */
const Game = {
   state: {
      difficulty: null,
      isRunning: false,
      questionData: {},
   },

   checkAnswer(selectedChoice) {
      // Utils.log(`User selected choice: ${selectedChoice}`, Utils.ENUM.LOG.INFO);
      if (parseInt(selectedChoice) === this.state.questionData.correctAnswerIndex) {
         // Utils.log("User selected the correct answer!", Utils.ENUM.LOG.INFO);
         // Show success animation
         User.updateAfterAnswer(true, this.state.questionData.operation, this.state.difficulty);
         Ui.updateScoreDisplay();
         Ui.showSuccessAnimation().then(() => {
            this.next();
         });
      } else {
         // Utils.log("User selected the wrong answer.", Utils.ENUM.LOG.INFO);
         User.updateAfterAnswer(false, this.state.questionData.operation, this.state.difficulty);
         Ui.showIncorrectAnimation().then(() => {});
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
      this.state.questionData = await MathModule.generateData(this.state.difficulty);
      // Utils.log(`Next question generated: ${this.state.questionData.question}`, Utils.ENUM.LOG.INFO);
      // Utils.log(`Choices: ${this.state.questionData.choices}`, Utils.ENUM.LOG.INFO);
      this.insertQuestion(this.state.questionData.question);
      this.populateChoices(this.state.questionData.choices);
   },

   setDifficulty(difficulty) {
      this.state.difficulty = difficulty;
   },

   reset() {
      Ui.updateScoreDisplay(User.state.user.score);
      this.insertQuestion("");
      this.populateChoices([]);
      this.state.isRunning = true;
   },

   async init() {
      Utils.log("Initializing Game Module", Utils.ENUM.LOG.INIT);
      // load the user info from local storage
      Game.reset();
      await Game.next();
   },
};

export default Game;
