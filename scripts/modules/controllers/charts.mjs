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
   convertForCharts(userStats, chartType) {
      // This function can be expanded to convert user stats into chart data format
      // For example, converting level stats or operation stats into {label, value} format
      // Currently, it's a placeholder and does not perform any conversion

      const calcPercentage = (obj) => {
         const total = obj.correct + obj.incorrect;
         if (total === 0) return 0;
         return Math.round((obj.correct / total) * 100);
      };
      let chartData = [];
      const typeData = userStats[chartType]; // e.g., levels or operations
      for (const key in typeData) {
         if (typeData.hasOwnProperty(key)) {
            chartData.push({ label: key, value: calcPercentage(typeData[key]) });
         }
      }
      // console.log("Converted chart data:", chartData);
      // If chartType is operations, convert labels
      chartData = chartType === "operations" ? this.convertOperationsLabels(chartData) : chartData;

      return chartData;
   },

   convertOperationsLabels(data) {
      return data.map((d) => ({ label: _operationsMap[d.label] || d.label, value: d.value }));
   },
};

export class HorizontalBarChart {
   constructor(el, data, options = {}) {
      this.el = el;
      this.data = data;
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

      this.resizeObserver = new ResizeObserver(() => this.render());
      this.resizeObserver.observe(this.el);
      this.render();
   }

   render() {
      const width = this.el.clientWidth || 600;
      const { leftAxisWidth, rightPadding, topPadding, bottomPadding, barHeight, barGap, tickCount } = this.options;
      const rows = this.data.length;
      const innerH = rows * barHeight + (rows - 1) * barGap;
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

      const xScale = (p) => (Math.max(0, Math.min(100, p)) / 100) * plotW;

      // grid + ticks
      for (let i = 0; i < tickCount; i++) {
         const t = (i / (tickCount - 1)) * 100;
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
         lbl.textContent = `${Math.round(t)}%`;
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
         rect.setAttribute("aria-label", `${d.label}: ${d.value}%`);
         svg.appendChild(rect);

         const valueText = document.createElementNS(svgNS, "text");
         const inside = barW > 36;
         valueText.setAttribute("x", plotX + (inside ? barW - 6 : barW + 6));
         valueText.setAttribute("y", y + barHeight / 2 + 4);
         valueText.setAttribute("text-anchor", inside ? "end" : "start");
         valueText.setAttribute("font-size", "12");
         valueText.setAttribute("fill", inside ? "#fff" : "currentColor");
         valueText.textContent = `${d.value}%`;
         svg.appendChild(valueText);
      });

      this.el.innerHTML = "";
      this.el.appendChild(svg);
   }

   updateData(newData) {
      this.data = newData;
      this.render();
   }
}
