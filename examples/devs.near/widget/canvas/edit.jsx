const { value, onChange, onSubmit, onCancel } = props;

let initialShapes = {};

if (typeof value === "string") {
  // I want to turn my string value into valid tldraw text
}

function handleSave(v) {
  console.log(v);
}

return (
  <div style={{ display: "flex" }}>
    <div style={{ width: "60vw", height: "80vh" }}>
      <Canvas
        // initialShapes={initialShapes}
        persistanceKey={"hello"}
        // onSave={handleSave}
      />
    </div>
  </div>
);
