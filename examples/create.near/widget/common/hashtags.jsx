const findHashtags = (str) => {
  const regexp = /\B\#\w\w+\b/g;
  let match;
  let tags = [];
  while ((match = regexp.exec(str)) !== null) {
    tags.push(match[0]);
  }
  return tags;
};

const getPosts = () => {
  const posts = Social.index("post", "main", {});
  return posts || [];
};

let allPosts = getPosts();

let hashtags = [];
allPosts.forEach((item) => {
  const post = Social.get(`${item.accountId}/post/main`, item.blockHeight);
  if (post) {
    hashtags.push(JSON.parse(post).text);
  }
});

let tagCount = {};
hashtags.forEach((item) => {
  const tags = findHashtags(item);
  tags.forEach((tag) => {
    let normalizedTag = tag.toLowerCase();
    tagCount[normalizedTag] = (tagCount[normalizedTag] || 0) + 1;
  });
});

let entries = Object.entries(tagCount);
let sortedHashtags = entries.sort((a, b) => b[1] - a[1]).slice(0, 888);
const Wrapper = styled.div`
--gray1:#dbe1e8;--gray2:#b2becd;--gray3:#6c7983;--gray4:#454e56;--gray5:#2a2e35;--gray6:#12181b;--nav-width:4em;--font-body:"sofia-pro",sans-serif;--font-head:"sofia-pro",sans-serif;--font-code:"attribute-mono",monospace;--font-size:20px;--max-width-bp:768px;--orange-pink:linear-gradient(to bottom right,var(--orange-light),var(--orange-dark) 85%);--green-grad:linear-gradient(to bottom right,var(--green-light),var(--green-dark) 85%);--background:var(--gray6);--text-color:var(--gray2);--h-color:#fff;--nav-shadow:4px 0 10px -3px #010101;--card-shadow:0 4px 8px rgba(0,0,0,0.38);--toc-shadow:rgba(0,0,0,0.7) 0px 10px 20px 0px;--nav-bg:var(--gray5);--tag-bg:var(--gray4);--code-bg:#22262f;--card-bg:var(--gray5);--overlay-bg:rgba(0,0,0,0.9);--h-border:2px dashed var(--nav-bg);--nav-border:2px dashed var(--text-color);--card-radius:0.25em;transition: all .3s ease

.container {
    background: var(--background);
    color: var(--text-color);
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--font-size);
    display: flex;
    min-height: 100vh;
    flex-direction: column
}

.tag {
    display: inline-block;
    border-radius: 3px;
    padding: .2em .5em .3em;
    border-radius: 2px;
    background: var(--tag-bg);
    color: #fff;
    font-weight: 555;
    margin: .25em .1em
}

h1.tag {
    margin-left: 0;
    margin-right: 0
}

.tag-sm {
    font-size: .7em;
    display: inline-block;
    letter-spacing: .15ch;
    font-weight: 400
}

.tag-lg {
    font-size: 1.2em;
    border-radius: 4px
}


`;
return (
  <>
    <Wrapper class="container">
      {sortedHashtags.length > 0 &&
        sortedHashtags.map((item, index) => (
          <a href={`https://near.social/?hashtag=${item[0].replace("#", "")}`}>
            <span className={`tag tag-${index} tag-lg`}>
              {item[0].replace("#", "")} - {item[1]}
            </span>
          </a>
        ))}
    </Wrapper>
  </>
);
