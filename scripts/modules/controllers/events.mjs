import router from "../services/routing.mjs";
import * as Utils from "../utilities/utils.mjs";
import Dom from "./dom.mjs";
import Game from "./Game.mjs";
import Ui from "./ui.mjs";
/**
 * METHOD: Events Module
 * Handles event binding and delegation
 */
const Events = {
   init() {
      Utils.log("Initializing Events Module", Utils.ENUM.LOG.INIT);
      Dom.btnDifficulty.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            const selectedDifficulty = e.target.closest(".btn-difficulty").dataset.difficulty;
            Game.setDifficulty(selectedDifficulty);
            Game.init();
            router.navigate("game");
            Ui.showView("game");
         });
      });

      Dom.btnChoices.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            const selectedChoice = e.target.dataset.choice;
            Game.checkAnswer(selectedChoice);
         });
      });
   },
};

export default Events;
