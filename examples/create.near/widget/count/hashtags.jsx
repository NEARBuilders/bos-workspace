const [hashtag, setHashtag] = useState("");
const [hashtagCount, setHashtagCount] = useState(0);
const [loading, setLoading] = useState(false);
const [done, setDone] = useState(false);

const getPosts = () => {
  const posts = Social.index("post", "main", {});
  return posts || [];
};

const handleCount = () => {
  setLoading(true);
  let allPosts = getPosts();
  let count = 0;
  const formattedHashtag = `#${hashtag.trim().toLowerCase()}`;

  allPosts.forEach((item) => {
    const post = Social.get(`${item.accountId}/post/main`, item.blockHeight);
    if (post) {
      try {
        const parsedPost = JSON.parse(post);
        if (parsedPost && typeof parsedPost.text === "string") {
          const postText = parsedPost.text.toLowerCase();
          if (postText.includes(formattedHashtag)) {
            count++;
          }
        }
      } catch (error) {
        console.error("ERROR:", error);
      }
    }
  });

  setHashtagCount(count);
  setLoading(false);
  setDone(true);
};

return (
  <>
    <div className="m-2">
      <input
        type="text"
        placeholder="input hashtag ~ do not include #"
        value={hashtag}
        onChange={(e) => setHashtag(e.target.value)}
      />
      <button
        disabled={hashtag === ""}
        className="btn btn-primary mt-3"
        onClick={handleCount}
      >
        Count
      </button>
    </div>
    {done && (
      <h5 className="m-3">
        <b>Total:</b> {hashtagCount}
      </h5>
    )}
  </>
);
