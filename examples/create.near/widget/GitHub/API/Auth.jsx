const [apiKey, setApiKey] = useState("");
const [owner, setOwner] = useState("");
const [repo, setRepo] = useState("");
const [githubData, setGithubData] = useState(null);
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const githubApiBaseUrl = "https://api.github.com";

const handleFetch = () => {
  console.log("handleFetch called");

  if (apiKey.trim() === "") {
    setError("invalid access token");
    return;
  }

  if (owner.trim() === "") {
    setError("invalid username");
    return;
  }

  if (repo.trim() === "") {
    setError("invalid repository");
    return;
  }

  setIsLoading(true);
  setError(null);

  const apiUrl = `${githubApiBaseUrl}/repos/${owner}/${repo}/contents`;

  const headers = {
    Authorization: `token ${apiKey}`,
  };

  asyncFetch(apiUrl, { headers })
    .then((response) => {
      if (!response.ok) {
        setError(`HTTP error! Status: ${response.status}`);
      }
      return response;
    })
    .then((data) => {
      console.log("Data:", data);
      const files = data.body;
      setGithubData(files);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setGithubData(null);
    });
};

return (
  <div>
    <div className="m-3">
      <h3 className="mb-2">GitHub API</h3>
      <h5 className="mb-2">Authentication Demo</h5>

      <p>
        <i>→ interact with a private repository</i>
      </p>
      <input
        type="text"
        placeholder="personal access token"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
    </div>
    <div className="m-3">
      <input
        type="text"
        placeholder="owner / username"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
    </div>
    <div className="m-3">
      <input
        type="text"
        placeholder="repository name"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <button className="btn btn-outline-primary mt-3" onClick={handleFetch}>
        Fetch
      </button>
      {githubData && (
        <div className="mt-3 m-1">
          <hr />
          <h5>Content:</h5>
          <ul>
            {githubData.map((file) => (
              <li key={file.name}>
                <a
                  href={file.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-3 m-1">{error && <p>{error}</p>}</div>
    </div>
  </div>
);
