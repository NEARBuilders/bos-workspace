const chartData = props.chartData ?? {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};
const chartOptions = props.chartOptions ?? {
  type: "line",
  options: { responsive: true },
};

/** 
For more information on how to use Chart.js, please refer to their documentation: https://www.chartjs.org/docs/latest/
**/

const code = `
<html>
<head>
<script src="https://unpkg.com/chart.js@4.3.0/dist/chart.umd.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>
</head>
<body>
<canvas id="myChart"></canvas>
</body>
<script>
    function createChart(ctx, data, options) {
        new Chart(ctx, {
            type: options.type,
            data: data,
            options: options.options
        });
    }

    window.addEventListener('message', function(event) {
    }, false);

    const handleMessage = (m) => {
        const { data, options } = m;
        const ctx = document.getElementById('myChart').getContext('2d');
        createChart(ctx, data, options);
    };

    window.iFrameResizer = {
        onMessage: handleMessage
    }
</script>
</html>
`;

return (
  <iframe
    iframeResizer
    className="w-100"
    srcDoc={code}
    message={{ data: chartData, options: chartOptions }}
  />
);
