import { Charts, HorizontalBarChart } from "./charts.mjs";
import Ui from "./ui.mjs";
import User from "./user.mjs";

const modalSummary = {
   userStats: {},
   chartType: "levels",
   charts: {
      levels: null,
      operations: null,
   },
   _eventsInitialized: false,

   Dom: {
      allStats: document.querySelectorAll(".stats-main-stat-value"),
      chartSelector: document.querySelector(".chart-selector"),
      allChartSelectors: document.querySelectorAll(".chart-btn"),
      chartContainer: document.querySelector(".chart-container"),
      btnClose: document.querySelector(".modal-close"),
   },

   Events: {
      init() {
         modalSummary.Dom.chartSelector.addEventListener("click", (e) => {
            // console.log("Chart selector clicked:", e.target);
            if (e.target.classList.contains("chart-btn")) {
               modalSummary.handleChartSelectorClick(e.target);
            }
         });

         modalSummary.Dom.btnClose.addEventListener("click", () => {
            Ui.closeModal("summary");
         });
      },
   },

   handleChartSelectorClick(target) {
      const selectedChart = target.dataset.chart;

      if (this.chartType === selectedChart) return; // No change

      this.chartType = selectedChart;
      this.showChart(selectedChart);
   },

   buildCharts() {
      // Get all chart data at once
      const allData = Charts.convertForCharts(this.userStats);
      // console.log("Building charts with data:", allData);

      // Store the chart data for later use
      this.chartData = allData;

      // Create or update ALL charts upfront to avoid creation during switching
      Object.keys(allData).forEach((type) => {
         this.createOrUpdateChart(type);
      });

      // Show the selected chart
      this.showChart(this.chartType);
   },

   createOrUpdateChart(chartType) {
      const data = this.chartData[chartType];

      if (this.charts[chartType]) {
         // Update existing chart
         // console.log(`Updating existing ${chartType} chart`);
         this.charts[chartType].updateData(data);
      } else {
         // Create new chart container for this type
         // console.log(`Creating new ${chartType} chart from scratch`);
         const chartDiv = document.createElement("div");
         chartDiv.style.display = "block"; // Always visible for layout
         chartDiv.style.visibility = "hidden"; // Start hidden but maintain layout
         chartDiv.style.position = "absolute"; // Stack them on top of each other
         chartDiv.style.top = "0";
         chartDiv.style.left = "0";
         chartDiv.style.width = "100%";
         chartDiv.style.minWidth = "300px";
         chartDiv.style.maxWidth = "900px";
         chartDiv.style.height = "280px"; // Fixed height to prevent jumping
         chartDiv.style.overflow = "hidden"; // Prevent any layout spillover
         chartDiv.className = `chart-${chartType}`;
         this.Dom.chartContainer.appendChild(chartDiv);

         // Create the chart
         const options = {
            showPercentage: false, // Currently showing integer values (correct answers)
         };
         this.charts[chartType] = new HorizontalBarChart(chartDiv, data, options);
      }
   },

   showChart(chartType) {
      // console.log(`Showing chart: ${chartType}`);

      // Use visibility instead of display to avoid any layout recalculation
      Object.keys(this.charts).forEach((type) => {
         if (this.charts[type] && this.charts[type].el) {
            this.charts[type].el.style.visibility = type === chartType ? "visible" : "hidden";
         }
      });

      // Update UI
      this.updateChartSelectorUI();
   },

   updateChartSelectorUI() {
      this.Dom.allChartSelectors.forEach((btn) => {
         btn.classList.toggle("active", btn.dataset.chart === this.chartType);
      });
   },

   init() {
      // console.log("modalSummary.init() called");
      // Only initialize events once
      if (!this._eventsInitialized) {
         // console.log("Initializing events for the first time");
         this.Events.init();
         this._eventsInitialized = true;
      } else {
         // console.log("Events already initialized, skipping");
      }

      // Set fixed height on chart container to prevent jumping
      this.Dom.chartContainer.style.height = "300px";
      this.Dom.chartContainer.style.position = "relative";
      this.Dom.chartContainer.style.transition = "opacity 0.15s ease-in-out";

      // Refresh the modal content
      this.refresh();
   },

   refresh() {
      // console.log("modalSummary.refresh() called");
      // Get fresh user stats
      this.userStats = User.Stats.get();

      // Only set default chart type if not already set
      if (!this.chartType) {
         this.chartType = "levels"; // Default chart type
      }

      // Update stats display
      this.Dom.allStats.forEach((statElem) => {
         const statKey = statElem.dataset.stat;
         statElem.textContent = this.userStats[statKey];
      });

      // Build/update both charts and show the current one
      this.buildCharts();
   },

   // Clean up method to destroy charts when modal closes
   cleanup() {
      // console.log("Cleaning up modalSummary - destroying existing charts");
      Object.keys(this.charts).forEach((type) => {
         if (this.charts[type] && typeof this.charts[type].destroy === "function") {
            // console.log(`Destroying ${type} chart`);
            this.charts[type].destroy();
         }
         this.charts[type] = null;
      });
      this.Dom.chartContainer.innerHTML = "";
      this.chartData = null;
   },
};

export default modalSummary;
