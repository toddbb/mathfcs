import { Config } from "./modules/config/config.mjs";
import Dom from "./modules/controllers/dom.mjs";
import Events from "./modules/controllers/events.mjs";
import Game from "./modules/controllers/Game.mjs";
import MathModule from "./modules/controllers/maths.mjs";
import Ui from "./modules/controllers/ui.mjs";
import User from "./modules/controllers/user.mjs";
import router from "./modules/services/routing.mjs";
import AppStorage from "./modules/services/storageService.mjs";
import * as Utils from "./modules/utilities/utils.mjs";

function initRouter() {
   router
      .addRoute("/", () => {
         Ui.showView("start");
      })
      .addRoute("/game", () => {
         Ui.showView("game");
      })
      /* .setNotFound(() => {
         Ui.showView("view-404");
      }) */
      .init();
}

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
   initRouter();

   // check if the current route is "/", if so, show the start view
   if (router.getCurrentPath() !== "/") {
      router.navigate("/");
   }

   Ui.showView("start");

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
