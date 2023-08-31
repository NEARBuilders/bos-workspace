/*__@import:everything/utils/propsChecker__*/

const typeDef = {
  properties: {
    name: {
      type: "string",
      defaultValue: "a",
      enum: ["a", "b", "c"],
      validation: {
        required: false,
      },
    },
    isHappy: {
      type: "boolean",
      defaultValue: true,
    },
    bio: {
      type: "md",
      defaultValue: "## Markdown Content\n\nThis is a sample markdown content.",
      validation: {
        required: false,
        min: 0,
        max: 500,
      },
    },
    favoriteNumber: {
      type: "number",
      defaultValue: 10,
      enum: [10, 20, 30],
      validation: {
        min: 0,
        max: 100,
      },
    },
    address: {
      type: {
        properties: {
          street: {
            type: "string",
            validation: {
              required: true,
            },
          },
          city: {
            type: "string",
            validation: {
              required: true,
            },
          },
        },
      },
      validation: {
        required: false,
      },
    },
    dateOfBirth: {
      type: "date",
      defaultValue: "2023-08-10",
      validation: {
        min: "2019-08-13",
        max: "2023-08-13",
      },
    },
    links: {
      type: "array",
      itemTypes: [
        {
          type: "string",
          validation: {
            min: 0,
            max: 20,
            pattern: "https://",
          },
        },
        "efiz.near/type/github",
      ],
      defaultValue: ["item1", "item2", "item3"],
      validation: {
        min: 0,
        max: 10,
        uniqueItems: true,
      },
    },
  },
};

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

const data = typeToEmptyData(typeDef);

// return <p>{JSON.stringify(data)}</p>

return (
  <>
    <MissingPropsWarning props={props} typeDef={typeDef} />
    <p>Hello</p>
  </>
);
