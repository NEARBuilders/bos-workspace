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
