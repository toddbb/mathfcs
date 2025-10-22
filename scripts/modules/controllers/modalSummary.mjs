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

      // Create or update both charts
      Object.keys(allData).forEach((type) => {
         if (this.charts[type]) {
            // Update existing chart
            this.charts[type].updateData(allData[type]);
         } else {
            // Create new chart container for this type
            const chartDiv = document.createElement("div");
            chartDiv.style.display = type === this.chartType ? "block" : "none";
            chartDiv.style.width = "100%";
            chartDiv.style.minWidth = "300px";
            chartDiv.style.maxWidth = "900px";
            chartDiv.className = `chart-${type}`;
            this.Dom.chartContainer.appendChild(chartDiv);

            // Create the chart
            this.charts[type] = new HorizontalBarChart(chartDiv, allData[type]);
         }
      });

      this.showChart(this.chartType);
   },

   showChart(chartType) {
      // Hide all charts
      Object.keys(this.charts).forEach((type) => {
         if (this.charts[type] && this.charts[type].el) {
            this.charts[type].el.style.display = "none";
         }
      });

      // Show the selected chart
      if (this.charts[chartType] && this.charts[chartType].el) {
         this.charts[chartType].el.style.display = "block";
      }

      // Update UI
      this.updateChartSelectorUI();
   },

   updateChartSelectorUI() {
      this.Dom.allChartSelectors.forEach((btn) => {
         btn.classList.toggle("active", btn.dataset.chart === this.chartType);
      });
   },

   init() {
      // Only initialize events once
      if (!this._eventsInitialized) {
         this.Events.init();
         this._eventsInitialized = true;
      }

      // Refresh the modal content
      this.refresh();
   },

   refresh() {
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
      Object.keys(this.charts).forEach((type) => {
         if (this.charts[type] && typeof this.charts[type].destroy === "function") {
            this.charts[type].destroy();
         }
         this.charts[type] = null;
      });
      this.Dom.chartContainer.innerHTML = "";
   },
};

export default modalSummary;
