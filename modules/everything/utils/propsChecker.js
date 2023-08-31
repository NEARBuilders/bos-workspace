function checkProps(props, typeDef, prefix) {
  if (!prefix) {
    prefix = "";
  }
  const missingProps = [];

  for (const [key, value] of Object.entries(typeDef.properties)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (!props.hasOwnProperty(key)) {
      missingProps.push(`${fullKey}`);
      continue;
    }

    const propValue = props[key];

    if (value.type === "object" && value.properties) {
      missingProps.push(...checkProps(propValue, value, fullKey));
    }

    if (value.validation && value.validation.required && propValue == null) {
      missingProps.push(`${fullKey} (required)`);
    }
  }

  return missingProps;
}

function MissingPropsWarning({ props, typeDef }) {
  const missingProps = checkProps(props, typeDef);

  return (
    missingProps.length > 0 && (
      <div
        className="card border-warning mb-3 shadow"
        style={{ maxWidth: "30rem", margin: "auto" }}
      >
        <div className="card-header text-white bg-warning">
          <h4 className="card-title mb-0">Attention!</h4>
        </div>
        <div className="card-body text-danger">
          <p className="card-text">
            There {missingProps.length === 1 ? "is" : "are"}{" "}
            {missingProps.length} missing or invalid prop
            {missingProps.length === 1 ? "" : "s"}:
          </p>
          <ul className="list-group list-group-flush">
            {missingProps.map((prop) => (
              <li key={prop} className="list-group-item">
                <pre className="m-0">{prop}</pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
}
