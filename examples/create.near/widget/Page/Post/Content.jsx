const content = props.content;
const raw = !!props.raw;

return content ? (
  <>
    {content.text &&
      (raw ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>{content.text}</pre>
      ) : (
        <Widget
          src="mob.near/widget/SocialMarkdown"
          props={{
            text: content.text,
            onHashtag: (hashtag) => (
              <span
                key={hashtag}
                className="d-inline-flex"
                style={{ fontWeight: 500 }}
              >
                <a href={`#/?hashtag=${hashtag}`}>#{hashtag}</a>
              </span>
            ),
          }}
        />
      ))}
    {content.image &&
      (raw ? (
        <div>
          <pre>{JSON.stringify(content.image, undefined, 2)}</pre>
        </div>
      ) : (
        <div className="w-100 rounded-3 text-center">
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: content.image,
              className: "img-fluid rounded-3",
              style: { maxHeight: "100vh" },
            }}
          />
        </div>
      ))}
  </>
) : (
  <span
    className="spinner-grow spinner-grow-sm me-1"
    role="status"
    aria-hidden="true"
  />
);
