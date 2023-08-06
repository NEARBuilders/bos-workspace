// DRAFT

const fetcher = props.fether ?? {};
const daoId = props.daoId;

const outgoing = fetcher["outgoing_near"](daoId);

if (!outgoing.body) {
  // TODO: Add proper loading
  return "Loading...";
}

const colors = props.colors ?? [
  "#4498E0",
  "#FFD50D",
  "#F29BC0",
  "#82E299",
  "#F19D38",
];

// Organize the data
const data = outgoing.body.slice(0, 20).map((d) => parseFloat(d.amount));
const labels = outgoing.body.slice(0, 20).map((d) => {
  if (d.receiver.length > 20) {
    return d.receiver.slice(0, 19) + "...";
  }
  return d.receiver;
});

console.log(data);

// fill the rest of colors if balanceData.length > colors.length
if (data.length > colors.length) {
  for (let i = colors.length; i < data.length; i++) {
    colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
  }
}

// format to small characters like 200k, 200m, 200b...
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

const chartData = {
  labels: labels,
  datasets: [
    {
      label: "Total NEAR received",
      data: data,
      backgroundColor: colors,
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  type: "bar",
  options: {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

return (
  <div
    style={{
      width: "100%",
      height: 770,
    }}
  >
    <Widget
      src={`nearui.near/widget/Data.ChartJs`}
      props={{ chartData, chartOptions }}
    />
  </div>
);
