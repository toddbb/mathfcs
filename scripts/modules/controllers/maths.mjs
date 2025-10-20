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
   operation: null,
   difficultyOperations: {
      1: ["+"],
      2: ["+", "-"],
      3: ["+", "-", "*"],
      4: ["+", "-", "*", "/"],
   },
   difficultySettings: {
      1: {
         "+": [1, 10],
      },
      2: {
         "+": [1, 20],
         "-": [1, 10],
      },
      3: {
         "+": [10, 30],
         "-": [1, 20],
         "*": [1, 10],
      },
      4: {
         "+": [10, 40],
         "-": [10, 30],
         "*": [1, 12],
         "/": [1, 10],
      },
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
         correctAnswer: this.correctAnswer,
         operation: this.operation,
         difficulty: this.difficulty,
         correctAnswerIndex: this.correctAnswerIndex,
      };
   },

   _getRandomOperation() {
      const operations = this.difficultyOperations[this.difficulty];
      const randomIndex = Utils.getRandomInclusive(0, operations.length - 1);
      return operations[randomIndex];
   },

   async _generateQuestion() {
      this.operation = this._getRandomOperation();
      const minNum = this.difficultySettings[this.difficulty][this.operation][0];;
      const maxNum = this.difficultySettings[this.difficulty][this.operation][1];
      let num1 = Utils.getRandomInclusive(minNum, maxNum);
      let num2 = Utils.getRandomInclusive(minNum, maxNum);

      // For subtraction, ensure num1 is always >= num2 to avoid negative results
      if (this.operation === "-" && num1 < num2) {
         // Swap the numbers to ensure num1 >= num2
         [num1, num2] = [num2, num1];
      } else if (this.operation === "/") {
         // Ensure num1 is a multiple of num2 to avoid fractional answers
         num2 = Utils.getRandomInclusive(1, 10);
         num1 = num2 * Utils.getRandomInclusive(1, 10);
      }

      const question = `${num1} ${this.operation} ${num2}`;
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
