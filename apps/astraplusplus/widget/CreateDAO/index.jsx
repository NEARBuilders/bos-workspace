// -- Read and process types from SocialDB + helper functions

const isPrimitiveType = (type) =>
  ["string", "number", "boolean"].includes(type);

const isComplexType = (type) =>
  Array.isArray(type)
    ? "typesArray"
    : type === "array"
    ? "array"
    : typeof type === "object"
    ? "object"
    : typeof type === "string" && !isPrimitiveType(type)
    ? "custom"
    : null;

const rawTypes = Social.get("/*__@appAccount__*//type/*", "final");
if (rawTypes === null) return null;

const types = {};
// It finds custom types in the type definitions and fetches them from SocialDB.
function getCustomTypes(type, depth) {
  depth = depth || 0;
  if (depth > 10) {
    throw {
      message: `Maximum type depth exceeded, please check your type definitions.`,
      depth,
      current: type,
      types,
    };
  }

  type.properties.forEach((prop) => {
    (Array.isArray(prop.type) ? prop.type : [prop.type]).forEach((type) => {
      if (isComplexType(type) === "custom" && !types[type]) {
        const rawType = Social.get(`${type}`, "final");
        if (rawType) {
          types[type] = JSON.parse(rawType);
          getCustomTypes(types[type], depth + 1);
        }
      }
    });
  });
}

Object.keys(rawTypes).forEach((key) => {
  const type = JSON.parse(rawTypes[key]);
  types["/*__@appAccount__*//type/" + key] = type;
  getCustomTypes(type);
});

const PRIMITIVE_VALIDATIONS = {
  string: (value, { min, max, pattern }) => {
    if (typeof value !== "string")
      return `Expected a string, got ${typeof value}.`;

    if (min && value.length < min)
      return `Must be at least ${min} characters long.`;

    if (max && value.length > max)
      return `Must be at most ${max} characters long.`;

    if (pattern && !value.match(pattern))
      return `The value "${value}" does not match expected pattern: ${pattern}`;
  },
  number: (value, { min, max }) => {
    if (typeof value !== "number")
      return `Expected a number, got ${typeof value}.`;

    if (min && value < min) return `Must be at least ${min}.`;

    if (max && value > max) return `Must be at most ${max}.`;
  },
  boolean: (value) => {
    if (typeof value !== "boolean")
      return `Expected a boolean, got ${typeof value}.`;
  },
};

function validatePrimitiveType(type, value, constraints) {
  if (!isPrimitiveType(type))
    throw {
      message: `Unknown primitive type: ${type}`,
      type,
      value,
    };

  return PRIMITIVE_VALIDATIONS[type](value, constraints);
}

function validateType(type, value, parent) {
  if (value === undefined || value === "" || value === null) {
    if (parent.required) {
      return `This field is required but missing.`;
    }
    return;
  }

  if (isPrimitiveType(type))
    return validatePrimitiveType(type, value, parent[type].validation);

  if (isComplexType(type) === "typesArray") {
    const errors = [];
    for (const subType of type) {
      const error = validateType(subType, value, parent[subType]);
      if (!error) return; // Stop if a valid type is found
      errors.push(error);
    }
    if (errors.length === type.length) {
      // only return the deepest error
      for (const error of errors) {
        if (typeof error === "object") return error;
      }
      return errors[errors.length - 1];
    }
  }

  if (isComplexType(type) === "array") {
    if (!Array.isArray(value)) {
      return `Expected an array, got ${typeof value}.`;
    }

    if (
      parent["array"].validation.min &&
      value.length < parent["array"].validation.min
    ) {
      return `Must have at least ${parent["array"].validation.min} items.`;
    }

    if (
      parent["array"].validation.max &&
      value.length > parent["array"].validation.max
    ) {
      return `Must have at most ${parent["array"].validation.max} items.`;
    }

    for (const item of value) {
      const error = validateType(parent["array"].type, item, parent["array"]);
      if (error)
        return {
          [value.indexOf(item)]: error,
        };
    }
  }

  if (isComplexType(type) === "object") {
    if (typeof value !== "object" || Array.isArray(value)) {
      return `Expected an object, got ${typeof value}.`;
    }

    // Validate properties of the object
    for (const property of type.properties) {
      const propName = property.name;
      const propType = property.type;
      const propValue = value[propName];

      if (property.required && propValue === undefined) {
        return `Property ${propName} is required but missing.`;
      }

      if (propValue !== undefined) {
        const error = validateType(propType, propValue, property);
        if (error)
          return {
            [propName]: error,
          };
      }
    }
  }

  if (isComplexType(type) === "custom") {
    return validateType(types[type], value);
  }
}

const typeToEmptyData = (type) => {
  if (isPrimitiveType(type)) {
    switch (type) {
      case "string":
        return "";
      case "number":
        return null;
      case "boolean":
        return null;
    }
  }
  if (isComplexType(type) === "array") {
    return [];
  }
  if (isComplexType(type) === "typesArray") {
    return typeToEmptyData(type[0]);
  }
  if (isComplexType(type) === "object") {
    const obj = {};

    type.properties.forEach((prop) => {
      const propType =
        isComplexType(prop.type) === "typesArray" ? prop.type[0] : prop.type;

      if (isPrimitiveType(propType)) {
        obj[prop.name] = typeToEmptyData(propType);
      } else if (isComplexType(propType) === "array") {
        obj[prop.name] = typeToEmptyData(propType);
      } else if (isComplexType(propType) === "object") {
        obj[prop.name] = typeToEmptyData(prop[propType]);
      } else if (isComplexType(propType) === "custom") {
        obj[prop.name] = typeToEmptyData(types[propType]);
      }
    });

    return obj;
  }
  if (isComplexType(type) === "custom") {
    return typeToEmptyData(types[type]);
  }
};

return (
  <Widget
    src="/*__@appAccount__*//widget/CreateDAO.form"
    props={{
      validateType,
      typeToEmptyData,
      types,
    }}
  />
);
