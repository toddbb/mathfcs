/**
 * METHOD: Math Module
 * Handles math question generation and evaluation
 */
const MathModule = {
   question: "",
   choices: [],
   correctAnswer: null,
   correctAnswerIndex: null,
   difficulty: null,
   difficultyOperators: {
      easy: ["+"],
      medium: ["+", "-"],
      hard: ["+", "-", "*"],
      expert: ["+", "-", "*", "/"],
   },

   async generateData(difficulty) {
      this.difficulty = difficulty;
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
      const operators = this.difficultyOperators[this.difficulty];
      const randomIndex = Utils.getRandomInclusive(0, operators.length - 1);
      return operators[randomIndex];
   },

   async _generateQuestion() {
      const operator = this._getRandomOperator();
      let num1 = Utils.getRandomInclusive(1, 10);
      let num2 = Utils.getRandomInclusive(1, 10);

      // For subtraction, ensure num1 is always >= num2 to avoid negative results
      if (operator === "-" && num1 < num2) {
         // Swap the numbers to ensure num1 >= num2
         [num1, num2] = [num2, num1];
      } else if (operator === "/") {
         // Ensure num1 is a multiple of num2 to avoid fractional answers
         num2 = Utils.getRandomInclusive(1, 10);
         num1 = num2 * Utils.getRandomInclusive(1, 10);
      }

      const question = `${num1} ${operator} ${num2}`;
      // console.log(`📖 Generated question: ${question}`);
      return question;
   },

   async _calculateAnswer() {
      const result = eval(this.question);
      // console.log(`📖 Correct answer is: ${result}`);
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
      // console.log(`📖 Generated choices: ${allChoices}`);
      return allChoices;
   },
};

export default MathModule;
