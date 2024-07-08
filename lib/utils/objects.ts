/**
 * Simple object check.
 * @param item The item to check.
 * @returns {boolean} Returns true if the item is a non-array object, false otherwise.
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target The target object to merge into.
 * @param sources The source objects to merge.
 * @returns {object} Returns the merged object.
 */
export function mergeDeep(target: any, ...sources: any[]): object {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        // Ensure that target[key] is an object before merging
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        // Directly assign non-object values
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  // Recursively merge remaining sources
  return mergeDeep(target, ...sources);
}

/**
 * Deep substract two objects.
 * @param target The target object to substract by.
 * @param sources The source objects to substract.
 * @returns {object} Returns the substracted object.
 */
export function substractDeep(target: any, ...sources: any[]): object {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (!target[key])
        continue;

      if (isObject(source[key])) {
        if (isObject(target[key])) {
          substractDeep(target[key], source[key]);
          // If target[key] is now an empty object, delete it
          if (Object.keys(target[key]).length === 0)
            delete target[key];
        }
      } else {
        if (target[key] === source[key])
          delete target[key];
      }
    }
  }

  // Recursively merge remaining sources
  return substractDeep(target, ...sources);
}
