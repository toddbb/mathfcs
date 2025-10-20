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
         Utils.log("User data loaded from storage", "👤");
      } else {
         Utils.log("No user data found, initializing new user.", "👤");
         User.user = { name: "Guest", score: 0 };
         // Save the new user data immediately (not debounced for initial setup)
         User.set();
      }
      Ui.updateScoreDisplay(User.user.score);
   },
};

export default User;
