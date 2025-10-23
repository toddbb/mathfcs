import AppStorage from "../services/storageService.mjs";
import * as Utils from "../utilities/utils.mjs";
import Ui from "./ui.mjs";

/**
 * METHOD: User Module
 * Handles user data and interactions
 */
const User = {
   user: {
      name: null,
      score: 0,
      streak: 0,
      longest: 0,
      levels: {
         1: {
            correct: 0,
            incorrect: 0,
         },
         2: {
            correct: 0,
            incorrect: 0,
         },
         3: {
            correct: 0,
            incorrect: 0,
         },
         4: {
            correct: 0,
            incorrect: 0,
         },
      },
      operations: {
         "+": { correct: 0, incorrect: 0 },
         "-": { correct: 0, incorrect: 0 },
         "*": { correct: 0, incorrect: 0 },
         "/": { correct: 0, incorrect: 0 },
      },
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

   reset() {
      this.user = { name: "Guest", score: 0 };
      this.set();
      Ui.updateScoreDisplay(this.user.score);
   },

   updateStats(isCorrect = true, operation, level) {
      if (isCorrect) {
         this.user.levels[level].correct += 1;
         this.user.operations[operation].correct += 1;
         this.user.streak += 1;
         if (this.user.streak > this.user.longest) {
            this.user.longest = this.user.streak;
         }
      } else {
         this.user.levels[level].incorrect += 1;
         this.user.operations[operation].incorrect += 1;
         this.user.streak = 0;
      }
      this.set();
   },

   Stats: {
      getTotals() {
         const levels = User.user.levels;
         let attempts = 0;
         let correct = 0;
         let incorrect = 0;
         for (const level in levels) {
            attempts += levels[level].correct + levels[level].incorrect;
            correct += levels[level].correct;
            incorrect += levels[level].incorrect;
         }
         return { attempts, correct, incorrect };
      },
      getAccuracy() {
         let accuracy = 0;
         const totals = this.getTotals();
         if (totals.attempts === 0) return accuracy;
         accuracy = `${Math.round((totals.correct / totals.attempts) * 100)}%`;
         return { accuracy };
      },

      getTotalCorrect() {
         const levels = User.user.levels;
         let total = 0;
      },
      get() {
         return { ...User.user, ...this.getTotals(), ...this.getAccuracy() };
      },
   },

   init() {
      Utils.log("Initializing User Module", Utils.ENUM.LOG.INIT);
      // Use AppStorage consistently instead of direct localStorage access
      const userData = AppStorage().local.get("user_data");
      // check if userData has all of the keys as this.user; if not, initialize missing keys, but don't remove existing data
      if (userData) {
         User.user = { ...User.user, ...userData }; // update missing keys
         Utils.log("User data loaded from storage", "👤");
      } else {
         Utils.log("No user data found, initializing new user.", "👤");
         // User.user = { name: "Guest", score: 0};
         // Save the new user data immediately (not debounced for initial setup)
         User.set();
      }
      Ui.updateScoreDisplay(User.user.score);
   },
};

export default User;
