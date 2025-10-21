import { Charts, HorizontalBarChart } from "./charts.mjs";
import User from "./user.mjs";

const modalSummary = {
   userStats: {},
   chartType: "levels",
   charts: {
      levels: null,
      operations: null,
   },

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
            console.log("Chart selector clicked:", e.target);
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
      console.log("Selected chart:", selectedChart);
      if (this.chartType === selectedChart) return; // No change

      // Update active button styling
      this.Dom.allChartSelectors.forEach((btn) => {
         btn.classList.toggle("active", btn.dataset.chart === selectedChart);
      });

      this.chartType = selectedChart;
      this.buildChart();
   },

   buildChart() {
      const data = Charts.convertForCharts(this.userStats, this.chartType);
      this.Dom.chartContainer.innerHTML = ""; // Clear previous chart
      this.charts[this.chartType] = new HorizontalBarChart(this.Dom.chartContainer, data);
   },

   init() {
      // Events
      this.Events.init();

      // Get user stats
      this.userStats = User.Stats.get();
      this.chartType = "levels";
      console.log(this.userStats);
      this.Dom.allStats.forEach((statElem) => {
         const statKey = statElem.dataset.stat;
         //console.log(`Updating stat: ${statKey} with value: ${this.userStats[statKey]}`);
         statElem.textContent = this.userStats[statKey];
      });

      this.buildChart();
   },
};

export default modalSummary;
