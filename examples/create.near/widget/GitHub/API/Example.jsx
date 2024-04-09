const [query, setQuery] = useState("");
const [repositories, setRepositories] = useState([]);
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const githubApiBaseUrl = "https://api.github.com";

const handleSearch = () => {
  if (query.trim() === "") {
    setError("Please enter a valid search query.");
    return;
  }

  setIsLoading(true);
  setError(null);

  const apiUrl = `${githubApiBaseUrl}/search/repositories?q=${query}`;

  asyncFetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    })
    .then((data) => {
      console.log(data);

      setIsLoading(false);

      if (data.body.items.length > 0) {
        setRepositories(data.body.items);
        setError(null);
      } else {
        setRepositories([]);
        setError("no repositories found.");
      }
    })
    .catch((error) => {
      setIsLoading(false);
      setRepositories([]);
      setError("error fetching data from GitHub API");
      console.error(error);
    });
};

return (
  <div>
    <div className="m-2">
      <h5>GitHub API Example</h5>
      <input
        type="text"
        placeholder="input repository name or any keywords"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
    <div className="m-2">
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </div>
    {error && <p>{error}</p>}
    <ul>
      {repositories.map((repo) => (
        <li key={repo.id}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.full_name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
