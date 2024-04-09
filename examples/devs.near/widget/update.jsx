const src = props.src;
const update = props.update;
const source = Social.get(`${src}`);
const newVersion = Social.get(`${update}`);

const [ownerId, type, name] = src.split("/");

const handleCreate = () =>
  Social.set({
    [`${type}`]: {
      [`${name}`]: {
        "": `${source}`,
      },
    },
  });

return (
  <div className="m-2">
    <Widget
      src="hack.near/widget/notification.item"
      props={{
        L: value.type === "request" && "requested changes",
        R: (
          <div className="m-2">
            {source === newVersion ? (
              <div className="m-2">
                <button onClick={handleCreate}>Merge</button>
              </div>
            ) : (
              <div className="m-2">
                <button disabled>Merged</button>
              </div>
            )}
          </div>
        ),
        ...props,
      }}
    />
  </div>
);
