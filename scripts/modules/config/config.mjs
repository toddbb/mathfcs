/*********************************************************************/
/*                           Config Module                           */
/*********************************************************************/
const $AppName = "MathFC";

export const Config = {
   DEV_MODE: true,
   API_URL: $getBaseUrl(), // TO DO: change this for production
   APP_NAME: $AppName, // TO DO: Change this to your app name
   APP_NAME_LOWERCASE: $AppName.toLocaleLowerCase(),
   SESSION_STORAGE_PREFIX: $AppName.toLocaleLowerCase(), // TO DO: Change this to a unique prefix for this app
};

// Detect environment and set base URL
function $getBaseUrl() {
   const host = window.location.hostname;

   if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5500"; // or whatever your local server port is
   } else if (host.endsWith("github.io")) {
      return `https://${host}/${Config.APP_NAME_LOWERCASE}`; // replace with your actual GitHub repo name
   } else {
      return window.location.origin; // default fallback
   }
}
