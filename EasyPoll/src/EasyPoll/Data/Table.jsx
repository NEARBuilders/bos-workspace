const columns = props.columns ?? [];
const data = props.data ?? [];
const title = props.title ?? "exported";

State.init({
  loading: true,
});

const code = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/datatables.net-bs5@1.13.5/css/dataTables.bootstrap5.min.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/responsive/2.2.9/css/responsive.bootstrap5.min.css">

  <script src="https://unpkg.com/jquery@3.7.0/dist/jquery.min.js"></script>
  <script type="text/javascript" src="https://unpkg.com/datatables@1.10.18/media/js/jquery.dataTables.min.js"></script>
  <script type="text/javascript" src="https://unpkg.com/datatables.net-bs5@1.13.5/js/dataTables.bootstrap5.min.js"></script>
  <script type="text/javascript" src="https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.min.js"></script>


  <style>
  td {
    white-space: normal !important;
    word-wrap: break-word;
  }</style>
</head>
<body>
<table id="thetable" class="display nowrap table table-striped" style="width:100%">
<thead>
          <tr>
          </tr>
      </thead>
  </table>
</body>
<script>
const handleMessage = (m) => {
    const data = m;
    $('#thetable').DataTable( {
        responsive: true,
        data: data.tableData,
        columns: data.columns
    });
};

// finally, configure iframe resizer options before importing the script
window.iFrameResizer = {
    onMessage: handleMessage
}
</script>
<script type="text/javascript" src="https://unpkg.com/iframe-resizer@4.3.6/js/iframeResizer.contentWindow.js"></script>
</html>
`;

const Container = styled.div`
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    padding: 16px 24px;
  }
`;


function escapeCsvField(value) {
  if (typeof value === "string" && value.includes('"')) {
    // Escape double quotes by doubling them
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return `"${value}"`;
}

// Convert array to CSV string
let csvColumns = columns
  .map((row) => {
    return escapeCsvField(row["title"]);
  })
  .join(",");
let csv = data.map((row) => {
  return row.map((item) => escapeCsvField(item)).join(",");
});
csv.unshift(csvColumns);
csv = csv.join("\n");


const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
const csvURL = URL.createObjectURL(blob);

return (
  <Container>
    <div className="d-flex justify-content-between gap-2 mb-4 align-items-center flex-wrap px-2 px-sm-0">
      <h2
        style={{
          fontSize: title.length > 200 ? 18 : 24,
          fontWeight: 500,
          letterSpacing: "-1px",
        }}
      >
        {title}
      </h2>
      <a
        href={csvURL}
        download={title + ".csv"}
        className="ms-auto text-decoration-none"
        style={{
          minWidth: 150,
        }}
      >
        <Widget
          src="rubycop.near/widget/NDC.StyledComponents"
          props={{
            Button: {
              text: "Export CSV",
              icon: <i className="bi bi-file-earmark-arrow-down" />,
              className: "primary dark d-flex gap-2 align-items-center",
              onClick: () => {},
            },
          }}
        />
      </a>
    </div>
    {state.loading && (
      <div
        className="d-flex flex-column gap-1"
        style={{
          padding: "60px 12px",
        }}
      >
        <Widget
          src={`easypoll-v0.ndc-widgets.near/widget/Common.Spinner`}
          props={{
            color1: "#ffd50d",
            color2: "#4f46e5",
          }}
        />
        <span
          style={{
            fontWeight: "bold",
            fontsize: 15,
            color: "#4f46e5",
            textAlign: "center",
          }}
        >
          Loading...
        </span>
      </div>
    )}
    <iframe
      iframeResizer
      className="w-100"
      srcDoc={code}
      style={{
        display: state.loading ? "none" : "block",
      }}
      message={{ tableData: data, columns }}
      onLoad={() => {
        State.update({ loading: false });
      }}
    />
  </Container>
);
