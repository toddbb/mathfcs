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
   correctAnswerIndex: null,
   choices: [],
   difficulty: null,

   checkAnswer(selectedChoice) {
      // Utils.log(`User selected choice: ${selectedChoice}`, Utils.ENUM.LOG.INFO);
      if (parseInt(selectedChoice) === this.correctAnswerIndex) {
         // Utils.log("User selected the correct answer!", Utils.ENUM.LOG.INFO);
         User.updateScore(1);
         // Show success overlay animation
         Ui.showSuccessOverlay().then(() => {
            this.next();
         });
      } else {
         // Utils.log("User selected the wrong answer.", Utils.ENUM.LOG.INFO);

         // Show incorrect overlay animation
         Ui.showIncorrectOverlay().then(() => {
            //this.next();
         });
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
      const nextData = await MathModule.generateData(this.difficulty);
      const { question, choices, correctAnswerIndex } = nextData;
      Utils.log(`Next question generated: ${nextData.question}`, Utils.ENUM.LOG.INFO);
      // Utils.log(`Choices: ${nextData.choices}`, Utils.ENUM.LOG.INFO);
      this.insertQuestion(question);
      this.populateChoices(choices);
      this.correctAnswerIndex = correctAnswerIndex;
   },

   setDifficulty(difficulty) {
      this.difficulty = difficulty;
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

export default Game;
