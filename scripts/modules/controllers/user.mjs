import AppStorage from "../services/storageService.mjs";
import * as Utils from "../utilities/utils.mjs";
import Ui from "./ui.mjs";

/**
 * METHOD: User Module
 * Handles user data and interactions
 */
const User = {
   // default values when the app loads
   userTemplate: {
      name: "Guest",
      avatarId: 0,
      accuracy: "",
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

   state: {
      currentUserId: -1,
      user: null,
   },

   // Create a debounced version of the save function
   debouncedUpdateUser: null,

   /************** USER MANAGEMENT AND LOCAL STORAGE **************/
   Storage: {
      async addUser(user) {
         const users = await User.Storage.getAllUsers();
         users.push(user);
         AppStorage().local.set("users", users);
      },

      updateUser(useDebounce = true, userId = null) {
         const allUsers = User.Storage.getAllUsers();
         const currentUserId = userId || User.state.currentUserId || User.Storage.getCurrentUserId();

         // Error checking: make sure there is a current user to update
         const currentUserData = allUsers[currentUserId];
         if (currentUserData) {
            allUsers[currentUserId] = User.state.user;
         } else {
            console.error("No current user found to update.");
            return;
         }

         // Initialize the debounced function if it doesn't exist
         if (!User.debouncedUpdateUser && useDebounce) {
            User.debouncedUpdateUser = Utils.debounce(() => {
               AppStorage().local.set("users", allUsers);
            }, 2000);
         }

         // Call the debounced function
         if (useDebounce) {
            User.debouncedUpdateUser();
         } else {
            AppStorage().local.set("users", allUsers);
         }
      },

      // get the current user ID from storage
      getCurrentUserId() {
         return AppStorage().local.get("currentUserId");
      },

      // get all users from storage
      getAllUsers() {
         return AppStorage().local.get("users") || [];
      },
   },

   /******* Specific User Method "Stats" for calculating and getting user statistics *********/
   Stats: {
      _getTotals() {
         const levels = User.state.user.levels;
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

      _getAccuracy() {
         let accuracy = 0;
         const totals = this._getTotals();
         if (totals.attempts === 0) return accuracy;
         accuracy = `${Math.round((totals.correct / totals.attempts) * 100)}%`;
         return { accuracy };
      },

      _getScore() {
         const score = this._getTotals().correct;
         return { score };
      },

      get() {
         return { ...User.state.user, ...this._getAccuracy(), ...this._getScore(), ...this._getTotals() };
      },
   },

   /************ OTHER FUNCTION **********************/

   updateAfterAnswer(isCorrect = true, operation, level) {
      //console.log(`Updating user stats after answer. Correct: ${isCorrect}, Operation: ${operation}, Level: ${level}`);
      //console.log(User.state.user);
      if (isCorrect) {
         console.log("Answer was correct, updating stats accordingly.");
         User.state.user.levels[level].correct += 1;
         User.state.user.operations[operation].correct += 1;
         User.state.user.streak += 1;
         if (User.state.user.streak > User.state.user.longest) {
            User.state.user.longest = User.state.user.streak;
         }
      } else {
         //console.log("Answer was incorrect, updating stats accordingly.");
         User.state.user.levels[level].incorrect += 1;
         User.state.user.operations[operation].incorrect += 1;
         User.state.user.streak = 0;
      }
      //console.log(User.state.user);
      User.Storage.updateUser();
   },

   resetUser() {
      User.state.user = User.userTemplate;
      User.Storage.updateUser();
      Ui.updateScoreDisplay();
   },

   changeUser(userId) {
      Utils.log(`User Model: Changing current user to ID: ${userId}`, "👤");
      User.state.currentUserId = userId;
      AppStorage().local.set("currentUserId", userId);
   },

   updateUserStateAndStorage(userId, user) {
      User.state.user = { ...User.state.user, ...user };
      User.state.currentUserId = userId;
      this.changeUser(User.state.currentUserId);
      User.Storage.updateUser(false, userId);
   },

   /****************** INITIALIZATION *********************/

   init() {
      Utils.log("Initializing User Module", Utils.ENUM.LOG.INIT);
      // first, try to get the current user ID from storage
      const currentUserId = User.Storage.getCurrentUserId();

      // if there is a current user ID, update state; otherwise, create one with ID = 0
      if (currentUserId && currentUserId !== -1) {
         User.state.currentUserId = currentUserId;
      } else {
         User.state.currentUserId = 0; // default to first user
         AppStorage().local.set("currentUserId", User.state.currentUserId);
      }

      // next, get the user's data from the array of "users"
      const storedUsers = User.Storage.getAllUsers();

      // if there is an existing user, update state; otherwise, initialize a new user
      if (storedUsers && storedUsers[User.state.currentUserId]) {
         User.state.user = { ...User.state.user, ...storedUsers[User.state.currentUserId] }; // merge existing data and any extra keys from template
      } else {
         Utils.log("No existing user data found, initializing new user.", "👤");
         // Save the default or current user data immediately (not debounced for initial setup)
         User.Storage.addUser(User.userTemplate);
         User.state.user = { ...User.userTemplate };
      }
   },
};

export default User;
