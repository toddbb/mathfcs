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
