const balances = props.balances; // expected to be in Pikespeak.ai balances API format

if (!balances) {
  const baseApi = "https://api.pikespeak.ai";
  const publicApiKey = "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5";
  const fetchApiConfig = {
    mode: "cors",
    headers: {
      "x-api-key": publicApiKey,
    },
  };
  const res = fetch(
    `${baseApi}/account/balances?accounts=${[
      props.accountId ?? context.accountId,
    ]}`,
    fetchApiConfig
  );
  if (!res.body) {
    return "Loading...";
  }
  balances = res.body;
}

// Parsing the data to the format expected by the chart
const balancesTotal = balances.balancesTotal.sort(
  (a, b) => b.usdPrice - a.usdPrice
);
const balanceData = balancesTotal.map((balance) => balance.usdPrice);
const balanceLabels = balancesTotal.map((balance) => balance.contract);

let colors = props.colors ?? [
  "#4498E0",
  "#FFD50D",
  "#F29BC0",
  "#F19D38",
  "#82E299",
];

const other_colors = [
  "#1f77b4", // Muted Blue
  "#ff7f0e", // Safety Orange
  "#2ca02c", // Cooked Asparagus Green
  "#d62728", // Brick Red
  "#9467bd", // Muted Purple
  "#8c564b", // Chestnut Brown
  "#e377c2", // Raspberry Yogurt Pink
  "#7f7f7f", // Middle Gray
  "#bcbd22", // Curry Yellow-Green
  "#17becf", // Blue-Teal
];

// use other colors if balanceData.length > colors.length
if (balanceData.length > colors.length) {
  for (let i = colors.length; i < balanceData.length; i++) {
    colors.push(other_colors[i % other_colors.length]);
  }
}

// if still not enough, use random colors
if (balanceData.length > colors.length) {
  for (let i = colors.length; i < balanceData.length; i++) {
    colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
  }
}

const chartData = {
  labels: balanceLabels,
  datasets: [
    {
      data: balanceData,
      label: "Balance in USD",
      backgroundColor: colors,
      hoverBackgroundColor: colors,
      hoverOffset: -4,
      borderAlign: "inner",
      borderWidth: 2,
      hoverBorderWidth: 0,
    },
  ],
};

const code = `

<html>
  <head>
    <script src="https://unpkg.com/chart.js@4.3.0/dist/chart.umd.js"></script>
    <script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"
    ></script>
  </head>
  <body>
  <style>
  * {
  font-family: "Open Sans", sans-serif !important;  
  }
    #container {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 260px auto;
        grid-template-rows: 80px 1fr;
        column-gap: 26px;
        justify-items: center;
    }
    #titleContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 12px auto;
        gap: 8px;
    }
    #currentName {
        font-size: 16px;
        color: rgb(153, 153, 153);
        font-weight: 600;
        text-overflow: ellipsis;
        max-width: 220px;
        overflow: hidden;
    }
    #currentValue {
        font-size: 24px;
        font-weight: 600;
        color: rgb(0, 0, 0);
        font-family: "Open Sans", sans-serif;
    }
    #donutContainer {
        width: 260px;
        height: 260px;
    }
    #tableContainer {
        width: 100%;
        height: 100%;
        overflow: auto;
        grid-row-start: 1;
        grid-row-end: 3;
        grid-column: 2;
    }

    
    @media (max-width: 768px) {
        #container {
            grid-template-columns: 1fr;
            grid-template-rows: 80px 260px auto;
            row-gap: 26px;
        }
        #titleContainer {
            grid-row: 1;
            grid-column: 1;
        }
        #donutContainer {
            grid-row: 2;
            grid-column: 1;
        }
        #tableContainer {
            grid-row: 3;
            grid-column: 1;
        }
    }

 #table {   
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
  
  height: 100%;
  justify-content: center;
}
  #table .item {
    padding: 17px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #999;
    display: grid;
    grid-template-columns: 20px 1fr 1fr 1fr;
    align-items: center;
    gap: 10px;
  }

  #table.hover .item {
    opacity: 0.3 !important;
  }

    #table.hover .item.hover {
        opacity: 1 !important;
    }
  
  #table .item:last-child {
      border-bottom: none;
    }

  #table .item > span:nth-child(2) {
    text-transform: lowercase;
    color: #000;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #table .item > span:nth-child(3) {
    text-align: center;
  }

  #table .item > span:nth-child(4) {
    text-align: end;
  }

  #table .ball {
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }

  </style>
  <div id="container">
    <div id="titleContainer">
      <span id="currentName"> Total Balance </span>
      <span id="currentValue"> </span>
    </div>
    <div id="donutContainer">
        <canvas id="donutChart"></canvas>
    </div>
    <div id="tableContainer">
        <div id="table">

        </div>
    </div>
    </div>
  </body>
  
  <script>
  
  function initTable (balances, colors){
    var balancesTable = document.getElementById("table");

    balances.balancesTotal.forEach(function(balance, i) {
      var itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.id = "table-item-"+i;

      var ballSpan = document.createElement("span");
      ballSpan.className = "ball";
      ballSpan.style.background = colors[i];

      var contractSpan = document.createElement("span");
      contractSpan.title = balance.contract;
      contractSpan.textContent = balance.contract;

      var priceSpan = document.createElement("span");
      priceSpan.title = "$"+Number(balance.usdPrice).toFixed(2);
      priceSpan.textContent = "$"+Number(balance.usdPrice).toFixed(2);

      var amountSpan = document.createElement("span");
      amountSpan.title = Number(balance.amount);
      amountSpan.textContent = Number(balance.amount).toFixed(2) + " " + balance.symbol;

      itemDiv.appendChild(ballSpan);
      itemDiv.appendChild(contractSpan);
      itemDiv.appendChild(priceSpan);
      itemDiv.appendChild(amountSpan);

      balancesTable.appendChild(itemDiv);
    });
}

    function createChart(ctx, data, colors) {
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: {
          cutout: "66%",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },

            insideDoughnut: {},
          },
          onHover: handleHover,
        },
        plugins: [
          {
            id: "insideDoughnut",
            beforeDraw: beforeDraw,
          },
        ],
      });

      function beforeDraw(chart){
        const {
          chartArea: { left, top, right, bottom },
          ctx,
        } = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // Save the current canvas state
        ctx.save();

        // Set the font, alignment, baseline, and color
        ctx.font = "bold " + (right - left) * 0.14 + "px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";

        // If an element is being hovered
        if (chart.hoveredElement) {
          const { datasetIndex, dataIndex } = chart.hoveredElement;
          const dataset = chart.data.datasets[datasetIndex];
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const value = dataset.data[dataIndex];
          const percentage = ((value / total) * 100).toLocaleString(
              undefined,
              {
                  maximumFractionDigits: 2,
              }
          );

          // Draw the text
          ctx.fillText(percentage + "%", centerX, centerY);
        } else {
          ctx.fillText("100%", centerX, centerY);
        }

        // Restore the canvas state
        ctx.restore();
      }

      function handleHover(event, chartElement) {
        const activePoints = chart.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: true },
          true
        );

        const currentValue = document.getElementById('currentValue');
        const currentName = document.getElementById('currentName');

        if (chartElement[0]) {
          const datasetIndex = chartElement[0].datasetIndex;
          const dataIndex = chartElement[0].index;

          const dataset = chart.data.datasets[datasetIndex];

          // Store the original colors
          if (!dataset.originalColors) {
            dataset.originalColors = dataset.backgroundColor.slice();
          }

          if (activePoints.length > 0) {
            dataset.backgroundColor = dataset.backgroundColor.map((old, i) => {
              if (i !== dataIndex) {
                return colors[i] + "30";
              }
              return colors[i];
            });

            const value = dataset.data[dataIndex];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            );

            // Update the title
            currentValue.innerHTML = "$" + value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
            });
            currentName.innerHTML = chart.data.labels[dataIndex];


            // Store the hovered element indexes in the chart instance
            chart.hoveredElement = { datasetIndex, dataIndex };

            // Add hover state to the table
            document.querySelectorAll(".item").forEach(function(item) {
                item.classList.remove("hover");
            });
            var tableItem = document.getElementById("table-item-"+dataIndex);
            var tableEl = document.getElementById("table");
            tableItem.classList.add("hover");
            tableEl.classList.add("hover");

          } else {
            // Reset all elements to their original 
            dataset.backgroundColor = dataset.originalColors;
            chart.hoveredElement = null;
            
            document.getElementById("table").classList.remove("hover");
            document.querySelectorAll(".item").forEach(function(item) {
                item.classList.remove("hover");
            });
          }
        } else {
          // Reset all elements to their original color when not hovering over any element
          chart.data.datasets.forEach((dataset) => {
            if (dataset.originalColors) {
              dataset.backgroundColor = dataset.originalColors;
            }
          });
          chart.hoveredElement = null;

            currentValue.innerHTML = currentValue.dataset.value;
            currentName.innerHTML = currentName.dataset.value;

            
            
            document.getElementById("table").classList.remove("hover");
            document.querySelectorAll(".item").forEach(function(item) {
                item.classList.remove("hover");
            });
        }

        chart.update();
      }

    }

    window.addEventListener("message", function (event) {}, false);


    const formatNumber = (num) => {
        if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "b";
        }
        if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
        }
        if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        }
        return num;
    };


    const handleMessage = (m) => {
      const { data, colors, balances } = m;
        document.getElementById("currentName").innerHTML = "Total Balance";
        document.getElementById("currentValue").innerHTML = "$"+formatNumber(balances.totalUsd);
        document.getElementById("currentValue").title = "$"+balances.totalUsd;

        document.getElementById("currentName").dataset.value = "Total Balance";
        document.getElementById("currentValue").dataset.value = "$"+formatNumber(balances.totalUsd);

      const ctx = document.getElementById("donutChart").getContext("2d");
      createChart(ctx, data, colors);
      initTable(balances, colors);

      window.iFrameResizer.onMessage = ()=>{};
    };

    window.iFrameResizer = {
      onMessage: handleMessage,
    };
  </script>
</html>
`;

return (
  <div
    className="w-100"
    style={{
      minHeight: "300px",
      minWidth: "300px",
    }}
  >
    <iframe
      iframeResizer
      className="w-100"
      srcDoc={code}
      message={{
        data: chartData,
        colors,
        balances: {
          totalUsd: balances.totalUsd,
          balancesTotal: balancesTotal,
        },
      }}
    />
  </div>
);
