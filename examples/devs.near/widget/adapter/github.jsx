function get({ path }) {
  return fetch(`https://raw.githubusercontent.com/${path}`);
}

return { get };