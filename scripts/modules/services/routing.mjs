/**
 * Simple hash-based router for single-page applications
 * Usage:
 *   import Router from './router.mjs';
 *   const router = new Router();
 *   router.addRoute('/', () => { ... });
 *   router.addRoute('/about', () => { ... });
 *   router.init();
 */

class Router {
   constructor() {
      this.routes = {};
      this.currentRoute = null;
      this.notFoundHandler = null;
   }

   /**
    * Add a route handler
    * @param {string} path - Route path (e.g., '/', '/about', '/user/:id')
    * @param {Function} handler - Function to call when route matches
    */
   addRoute(path, handler) {
      this.routes[path] = handler;
      return this;
   }

   /**
    * Set a handler for when no route matches
    * @param {Function} handler - 404 handler function
    */
   setNotFound(handler) {
      this.notFoundHandler = handler;
      return this;
   }

   /**
    * Navigate to a specific route
    * @param {string} path - Path to navigate to
    * @param {boolean} addToHistory - Whether to add to browser history (default: true)
    */
   navigate(path, addToHistory = true) {
      if (addToHistory) {
         window.location.hash = path;
      } else {
         this.handleRoute(path);
      }
   }

   /**
    * Get the current path from the hash
    * @returns {string} Current path
    */
   getCurrentPath() {
      const hash = window.location.hash.slice(1);
      return hash || "/";
   }

   /**
    * Parse route parameters from path
    * @param {string} routePath - Route pattern (e.g., '/user/:id')
    * @param {string} actualPath - Actual path (e.g., '/user/123')
    * @returns {Object|null} Parameters object or null if no match
    */
   parseParams(routePath, actualPath) {
      const routeParts = routePath.split("/").filter(Boolean);
      const actualParts = actualPath.split("/").filter(Boolean);

      // Handle root route
      if (routePath === "/" && actualPath === "/") {
         return {};
      }

      if (routeParts.length !== actualParts.length) {
         return null;
      }

      const params = {};

      for (let i = 0; i < routeParts.length; i++) {
         if (routeParts[i].startsWith(":")) {
            const paramName = routeParts[i].slice(1);
            params[paramName] = decodeURIComponent(actualParts[i]);
         } else if (routeParts[i] !== actualParts[i]) {
            return null;
         }
      }

      return params;
   }

   /**
    * Handle the current route
    * @param {string} path - Path to handle
    */
   handleRoute(path) {
      this.currentRoute = path;

      // Try exact match first
      if (this.routes[path]) {
         this.routes[path]({});
         return;
      }

      // Try pattern matching for routes with parameters
      for (const [routePath, handler] of Object.entries(this.routes)) {
         if (routePath.includes(":")) {
            const params = this.parseParams(routePath, path);
            if (params !== null) {
               handler(params);
               return;
            }
         }
      }

      // No match found
      if (this.notFoundHandler) {
         this.notFoundHandler();
      } else {
         console.warn(`No route found for: ${path}`);
      }
   }

   /**
    * Initialize the router and start listening for hash changes
    */
   init() {
      // Handle hash changes
      window.addEventListener("hashchange", () => {
         const path = this.getCurrentPath();
         this.handleRoute(path);
      });

      // Handle initial route
      const initialPath = this.getCurrentPath();
      this.handleRoute(initialPath);

      return this;
   }

   /**
    * Get query parameters from URL
    * @returns {Object} Query parameters as key-value pairs
    */
   getQueryParams() {
      const params = {};
      const queryString = window.location.search.slice(1);

      if (queryString) {
         queryString.split("&").forEach((param) => {
            const [key, value] = param.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value || "");
         });
      }

      return params;
   }

   /**
    * Go back in history
    */
   back() {
      window.history.back();
   }

   /**
    * Go forward in history
    */
   forward() {
      window.history.forward();
   }
}

const router = new Router();
export default router;
