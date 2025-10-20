import { Config } from "./modules/config/config.mjs";
import Dom from "./modules/controllers/dom.mjs";
import Events from "./modules/controllers/events.mjs";
import Game from "./modules/controllers/Game.mjs";
import MathModule from "./modules/controllers/maths.mjs";
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

   // Initialize router after DOM elements are available
   initRouter({
      home: () => Ui.showView("home"), // Show home view for home route
      game: () => {
         // Check if game is running to determine if we can show game view
         if (!Game.isRunning) {
            window.location.hash = "home";
            return;
         }
         Ui.showView("game");
      },
   });

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
      });
   }
};

document.addEventListener("DOMContentLoaded", () => initAfterDOM());
