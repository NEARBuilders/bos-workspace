const isPrimitiveType = (type) =>
  ["string", "number", "boolean", "date", "md"].includes(type);

const isComplexType = (type) =>
  Array.isArray(type)
    ? "typesArray" // I don't know if we still need to handle this
    : type === "array"
    ? "array"
    : typeof type === "object"
    ? "object"
    : typeof type === "string" && !isPrimitiveType(type)
    ? "custom"
    : null;

const getDefaultForPrimitive = (type, defaultValue) => {
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  switch (type) {
    case "string":
      return "";
    case "number":
      return null; // should this be 0?
    case "boolean":
      return null; // do we want this to be false?
    case "date":
      return null; // do we want this to be today?
    case "md":
      return null;
  }
};

const typeToEmptyData = (typeDef) => {
  const obj = {};

  Object.keys(typeDef.properties).forEach((key) => {
    const fieldSchema = typeDef.properties[key];
    const type = fieldSchema.type;

    if (isPrimitiveType(type)) {
      obj[key] = getDefaultForPrimitive(type, fieldSchema.defaultValue);
    } else if (isComplexType(type) === "array") {
      obj[key] = fieldSchema.defaultValue ? [...fieldSchema.defaultValue] : [];
    } else if (isComplexType(type) === "object") {
      obj[key] = typeToEmptyData({ properties: type.properties });
    } else {
      console.log("edge case not handled for type: " + type);
      obj[key] = fieldSchema.defaultValue ?? null;
    }
  });

  return obj;
};

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

function MissingPropsWarning({ props, typeDef, WarningElement }) {
  const missingProps = checkProps(props, typeDef);
  return (
    missingProps.length > 0 && (
      <>
        {WarningElement ? (
          <WarningElement missingProps={missingProps} />
        ) : (
          <div
            className="card border-warning mb-3 shadow"
            style={{ maxWidth: "30rem", margin: "auto" }}
          >
            <div className="card-header text-white bg-warning">
              <h4 className="card-title mb-0">Attention!</h4>
            </div>
            <div className="card-body text-danger">
              <p className="card-text">
                {`There ${missingProps.length === 1 ? "is" : "are"} ${
                  missingProps.length
                } missing or invalid prop${
                  missingProps.length === 1 ? "" : "s"
                }:`}
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
        )}
      </>
    )
  );
}

/*__@import:everything/utils/UUID__*/

function filterByType(data, targetType) {
  return Object.keys(data || {}).reduce((result, key) => {
    if (data[key].metadata?.type === targetType) {
      result[key] = data[key];
    }
    return result;
  }, {});
}

function deepMerge(obj1, obj2) {
  return Object.keys({ ...obj1, ...obj2 }).reduce((acc, key) => {
    if (
      obj1[key] &&
      obj2[key] &&
      typeof obj1[key] === "object" &&
      typeof obj2[key] === "object"
    ) {
      acc[key] = deepMerge(obj1[key], obj2[key]);
    } else {
      acc[key] = obj2[key] !== undefined ? obj2[key] : obj1[key];
    }
    return acc;
  }, {});
}

/**
 * Gets all things of a given type, optionally filtered by accounts and blockHeight
 * @param {string} type - type of thing to filter by
 * @param {Array<string>} [accounts] - Optional list of accounts to filter by
 * @param {string|number} blockHeight - Optional blockHeight to use; defaults to "final"
 * @returns {object} - all things of the given type
 */
function getAllThings(type, accounts, blockHeight) {
  let paths;
  if (!blockHeight) {
    blockHeight = "final";
  }

  if (Array.isArray(accounts) && accounts.length) {
    // We could change this to get all metadata, metadata includes type
    // and then we have all we need in order to show on screens. Anything else can be fetched separately.
    paths = accounts.map((account) => `${account}/thing/*/metadata/*`);
  } else {
    paths = ["*/thing/*/metadata/*"];
  }
  const things = Social.get(paths, blockHeight);
  return filterByType(things, type) ?? {};
}

/**
 * Gets the thing matching id, optionally filtered by accounts and blockHeight
 * @param {string} id - thing id
 * @param {Array<string>} [accountIds] - Optional list of accounts to filter by. If not provided, defaults to any account.
 * @param {string|number} blockHeight - Optional blockHeight to use; defaults to "final"
 * @returns {object|null} - the thing, multiple things if matches id across accounts, or null if not found
 */
function getThing(id, accountIds, blockHeight) {
  let paths;
  if (!blockHeight) {
    blockHeight = "final";
  }

  if (Array.isArray(accountIds) && accountIds.length) {
    paths = accountIds.map((accountId) => `${accountId}/thing/${id}/**`);
  } else {
    paths = [`*/thing/${id}/**`];
  }

  const thing = Social.get(paths, blockHeight) || {};

  return thing;
}

function deleteThing(id) {
  Social.set({
    thing: {
      [id]: null,
    },
  });
}

/**
 * Creates a thing with the given type, data, and metadata
 * Subsequently calls onCommit or onCancel
 * @param {string} type - type of thing to create
 * @param {object} data - data to store
 * @param {object} metadata - metadata to store
 */
function createThing(type, data, metadata) {
  // Temporary small id
  const id = UUID.generate("xxxxxxx");
  return {
    [id]: {
      // I think there may be some value in stringify-ing the data and storing in empty key, but I'm not sure
      // Maybe it's for published data? Data that has no relations?
      // It's more space efficient for the social contract if we limit the number of keys
      "": JSON.stringify(data),
      data, // so I'm just gonna do both for right now :)
      metadata: { ...metadata, type },
    },
  };
}

return {
  filterByType,
  getThing,
  getAllThings,
  deepMerge,
  deleteThing,
  createThing,
  isPrimitiveType,
  isComplexType,
  getDefaultForPrimative,
  typeToEmptyData,
  checkProps,
  MissingPropsWarning,
};
