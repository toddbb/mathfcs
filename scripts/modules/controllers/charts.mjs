// Example usage:
/* const data = [
  { label: "Level 1", value: 35 },
  { label: "Level 2", value: 62 },
  { label: "Level 3", value: 78 },
  { label: "Level 4", value: 54 }
]; 


new HorizontalBarChart(document.getElementById("chart-container"), data);

*/

const _operationsMap = {
   "+": "(+)",
   "-": "(-)",
   "*": "(×)",
   "/": "(÷)",
};

export const Charts = {
   // Converts User Stats into chart-friendly data (see example object above)
   convertForCharts(userStats, chartType = null) {
      // subroutine to calculate the percantage based on correct/incorrect
      const calcPercentage = (obj) => {
         const total = obj.correct + obj.incorrect;
         if (total === 0) return 0;
         return Math.round((obj.correct / total) * 100);
      };

      // subroutine to convert a type's data into chart data format
      const convertTypeData = (typeData, type) => {
         const chartData = [];
         for (const key in typeData) {
            if (typeData.hasOwnProperty(key)) {
               // use this for percentage calculation
               // chartData.push({ label: key, value: calcPercentage(typeData[key]) });
               // use this for total correct answers calculation
               chartData.push({ label: key, value: typeData[key].correct });
            }
         }

         // return based on the chart category ("levels" or "operations")
         return type === "operations" ? this.convertOperationsLabels(chartData) : chartData;
      };

      // If specific chartType is requested, return only that data (backward compatibility)
      if (chartType) {
         return convertTypeData(userStats[chartType], chartType);
      }

      // Return both datasets
      return {
         levels: convertTypeData(userStats.levels, "levels"),
         operations: convertTypeData(userStats.operations, "operations"),
      };
   },

   convertOperationsLabels(data) {
      return data.map((d) => ({ label: _operationsMap[d.label] || d.label, value: d.value }));
   },
};

export class HorizontalBarChart {
   constructor(el, data, options = {}) {
      this.el = el;
      this.data = data;
      // add default options to parameter options
      this.options = Object.assign(
         {
            leftAxisWidth: 30,
            rightPadding: 20,
            topPadding: 16,
            bottomPadding: 32,
            barHeight: 28,
            barGap: 14,
            tickCount: 5, // 0%, 25%, 50%, 75%, 100%
         },
         options
      );

      this.resizeObserver = new ResizeObserver(() => {
         // Debounce resize renders to prevent excessive calls
         if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
         }
         this.resizeTimeout = setTimeout(() => {
            this.render();
         }, 16); // ~60fps
      });
      this.resizeObserver.observe(this.el);
      // console.log("HorizontalBarChart initialized with data:", this.data);
      this.render();
   }

   render() {
      // include or exclude a % sign, depending on data type
      const percentSign = this.options?.showPercentage ? "%" : "";

      // console.log("Rendering HorizontalBarChart with data:", this.data);
      const width = this.el.clientWidth || 600;
      const { leftAxisWidth, rightPadding, topPadding, bottomPadding, barHeight, barGap, tickCount } = this.options;
      const rows = this.data.length;

      // Use fixed height calculation to ensure consistent chart dimensions
      // Always calculate for a maximum of 4 rows to keep charts consistent
      const maxRows = 4;
      const innerH = maxRows * barHeight + (maxRows - 1) * barGap;
      const height = topPadding + innerH + bottomPadding;

      const w = Math.max(width, 300);
      const h = height;
      const plotX = leftAxisWidth;
      const plotY = topPadding;
      const plotW = w - leftAxisWidth - rightPadding;
      const plotH = innerH;

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", "100%");
      /* svg.setAttribute("height", "auto"); */
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Horizontal bar chart");

      // Determine if we're showing percentages or integers
      const isPercentage = this.options?.showPercentage || false;

      // Calculate the maximum scale value
      let maxScale;
      if (isPercentage) {
         maxScale = 100; // For percentage data, always use 0-100%
      } else {
         // For integer data, calculate a nice round scale with intuitive intervals
         const maxDataValue = Math.max(...this.data.map((d) => d.value));
         const targetMax = Math.max(10, maxDataValue * 1.1); // Ensure minimum of 10

         // Calculate nice round intervals (10s, 20s, 50s, 100s, etc.)
         // This makes the x-axis labels much more readable
         if (targetMax <= 10) {
            maxScale = 10;
         } else if (targetMax <= 20) {
            maxScale = 20;
         } else if (targetMax <= 50) {
            maxScale = 50;
         } else if (targetMax <= 100) {
            maxScale = 100;
         } else if (targetMax <= 200) {
            maxScale = 200;
         } else if (targetMax <= 500) {
            maxScale = 500;
         } else {
            // For larger values, round to nearest 100
            maxScale = Math.ceil(targetMax / 100) * 100;
         }
      }

      const xScale = (value) => (Math.max(0, Math.min(maxScale, value)) / maxScale) * plotW;

      // console.log(`xScale(maxScale: ${maxScale}): ${xScale(maxScale)}, plotW: ${plotW}`);

      // Build Grid & Ticks
      for (let i = 0; i < tickCount; i++) {
         const t = (i / (tickCount - 1)) * maxScale;
         const x = plotX + xScale(t);

         const grid = document.createElementNS(svgNS, "line");
         grid.setAttribute("x1", x);
         grid.setAttribute("y1", plotY);
         grid.setAttribute("x2", x);
         grid.setAttribute("y2", plotY + plotH);
         grid.setAttribute("stroke", "currentColor");
         grid.setAttribute("stroke-opacity", "0.15");
         grid.setAttribute("stroke-width", "1");
         svg.appendChild(grid);

         const lbl = document.createElementNS(svgNS, "text");
         lbl.setAttribute("x", x);
         lbl.setAttribute("y", plotY + plotH + 18);
         lbl.setAttribute("text-anchor", "middle");
         lbl.setAttribute("font-size", "12");
         lbl.textContent = `${Math.round(t)}${percentSign}`;
         svg.appendChild(lbl);
      }

      const axis = document.createElementNS(svgNS, "line");
      axis.setAttribute("x1", plotX);
      axis.setAttribute("y1", plotY + plotH);
      axis.setAttribute("x2", plotX + plotW);
      axis.setAttribute("y2", plotY + plotH);
      axis.setAttribute("stroke", "#ccc");
      axis.setAttribute("stroke-width", "1");
      svg.appendChild(axis);

      // Build Horizontal Bars
      this.data.forEach((d, i) => {
         const y = plotY + i * (barHeight + barGap);
         const barW = xScale(d.value);

         const ylbl = document.createElementNS(svgNS, "text");
         ylbl.setAttribute("x", leftAxisWidth - 8);
         ylbl.setAttribute("y", y + barHeight / 2 + 4);
         ylbl.setAttribute("text-anchor", "end");
         ylbl.setAttribute("font-size", "12");
         ylbl.textContent = d.label;
         svg.appendChild(ylbl);

         const rect = document.createElementNS(svgNS, "rect");
         rect.setAttribute("x", plotX);
         rect.setAttribute("y", y);
         rect.setAttribute("width", barW);
         rect.setAttribute("height", barHeight);
         rect.setAttribute("fill", "currentColor");
         rect.setAttribute("opacity", "0.9");
         rect.setAttribute("rx", "6");
         rect.setAttribute("tabindex", "0");
         rect.setAttribute("aria-label", `${d.label}: ${d.value}${percentSign}`);
         svg.appendChild(rect);

         const valueText = document.createElementNS(svgNS, "text");
         const inside = barW > 36;
         valueText.setAttribute("x", plotX + (inside ? barW - 6 : barW + 6));
         valueText.setAttribute("y", y + barHeight / 2 + 4);
         valueText.setAttribute("text-anchor", inside ? "end" : "start");
         valueText.setAttribute("font-size", "12");
         valueText.setAttribute("fill", inside ? "#fff" : "currentColor");
         valueText.textContent = `${d.value}${percentSign}`;
         svg.appendChild(valueText);
      });

      this.el.innerHTML = "";
      this.el.appendChild(svg);
   }

   updateData(newData) {
      this.data = newData;
      this.render();
   }

   destroy() {
      if (this.resizeTimeout) {
         clearTimeout(this.resizeTimeout);
         this.resizeTimeout = null;
      }
      if (this.resizeObserver) {
         this.resizeObserver.disconnect();
         this.resizeObserver = null;
      }
   }
}
