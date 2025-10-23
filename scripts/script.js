import { Config } from "./modules/config/config.mjs";
import Dom from "./modules/controllers/dom.mjs";
import Events from "./modules/controllers/events.mjs";
import Game from "./modules/controllers/game.mjs";
import MathModule from "./modules/controllers/maths.mjs";
import modalSummary from "./modules/controllers/modalSummary.mjs";
import Ui from "./modules/controllers/ui.mjs";
import User from "./modules/controllers/user.mjs";
import { initRouter } from "./modules/services/routing.mjs";
import AppStorage from "./modules/services/storageService.mjs";
import * as Utils from "./modules/utilities/utils.mjs";

/**
 * Function: init
 *
 * Initializes the DOM after it is loaded
 */
const initAfterDOM = () => {
   Utils.log("Initializing application after DOM load", Utils.ENUM.LOG.INIT);

   Dom.init();
   Events.init();
   User.init();
   Ui.init();

   // Initialize router after DOM elements are available
   initRouter({
      home: () => Ui.showView("home"),
      game: () => Ui.showView("game"),
   });

   /// FOR DEVELOPMENT OF MODAL ONLY -- simulate event triggered
   // Dom.btnSummary.click();

   if (Config.DEV_MODE) {
      import("./modules/utilities/debug.mjs").then(({ Debug }) => {
         Debug.init();
         window.Config = Config;
         window.Utils = Utils;
         window.Debug = Debug;
         window.Dom = Dom;
         window.Events = Events;
         window.Ui = Ui;
         window.Game = Game;
         window.User = User;
         window.AppStorage = AppStorage;
         window.MathModule = MathModule;
         window.modalSummary = modalSummary;
      });
   }
};

document.addEventListener("DOMContentLoaded", () => initAfterDOM());
