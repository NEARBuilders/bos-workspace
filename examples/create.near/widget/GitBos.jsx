const src = props.src ?? "devs.near/widget/community";
const update = props.update ?? "hack.near/widget/community";

State.init({
  src,
  update,
});

const source = Social.get(`${state.src}`);
const newVersion = Social.get(`${state.update}`);

const [creatorId, type, name] = src.split("/");

const handleCreate = () =>
  Social.set({
    [`${type}`]: {
      [`${name}`]: {
        "": `${newVersion}`,
      },
    },
  });

function generateUID() {
  return (
    Math.random().toString(16).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(16).slice(2)
  );
}

const requestId = props.requestId ?? generateUID();

const data = {
  index: {
    graph: JSON.stringify({
      key: "request",
      value: {
        type: "merge",
        src: state.src,
        update: state.update,
      },
    }),
    notify: JSON.stringify({
      key: creatorId,
      value: {
        type: "request",
        template: "hack.near/widget/notification",
        data: {
          type: "merge",
          src: state.src,
          update: state.update,
        },
      },
    }),
  },
};

const requests = Social.index("notify", context.accountId, {
  limit: 10,
  order: "desc",
  subscribe: true,
});

const Container = styled.div`
  .profile-image {
    width: 120px;
    height: 120px;
  }

  .top-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .bell-icon {
    font-size: 28px;
    color: #000;
    margin-left: 8px;
    text-decoration: none;
    transition: color 0.3s ease-in-out;
  }

  .bell-icon:hover {
    color: #000;
  }

  .bell-icon .bi-bell {
    display: inline;
  }

  .bell-icon .bi-bell-fill {
    display: none;
  }

  .bell-icon:hover .bi-bell {
    display: none;
  }

  .bell-icon:hover .bi-bell-fill {
    display: inline;
  }

  @media (max-width: 576px) {
    .profile-image {
      width: 160px;
      height: 160px;
    }
  }
`;

return (
  <Container>
    <div className="d-flex flex-wrap justify-content-between mb-3">
      <div className="m-1">
        <h1>gitbos</h1>
      </div>
      <div className="ms-auto me-0 me-md-2 d-flex align-items-center">
        <div className="top-right">
          <a href="/hack.near/widget/request.index" className="bell-icon me-2">
            <i className="bi bi-bell"></i>
            <i className="bi bi-bell-fill"></i>
          </a>
        </div>
      </div>
    </div>
    <div className="m-1">
      <h3>request changes</h3>
      <p>ask someone to update anything they created</p>
      <ol>
        <li>fork / duplicate whatever you want to update</li>
        <li>make helpful edits and suggestions, then save</li>
        <li>notify the original creator with a requested action</li>
      </ol>
      <p>creators can review, approve, and merge automatically</p>

      <h5 className="mt-4">original source path</h5>
      <p>
        <i>some thing to be updated:</i>
      </p>
    </div>

    <div className="input-group m-1 mb-2">
      <input
        className="form-control"
        defaultValue={state.src}
        onChange={(e) => {
          State.update({
            src: e.target.value,
          });
        }}
      />
    </div>
    <h5 className="m-1 mt-4">path of updated version</h5>
    <p className="m-1 mt-2">
      <i>new thing to be merged with original:</i>
    </p>
    <div className="input-group m-1 mb-2">
      <input
        className="form-control mt-2"
        defaultValue={state.update}
        onChange={(e) => {
          State.update({
            update: e.target.value,
          });
        }}
      />
    </div>
    <CommitButton
      disabled={source === newVersion}
      className="btn btn-outline-secondary m-1 mt-3"
      data={data}
    >
      <i className="bi bi-git"></i>
      send request
    </CommitButton>
    <hr />
    <h3>review</h3>
    <Widget
      src="hack.near/widget/compare"
      props={{ src: state.src, update: state.update }}
    />
  </Container>
);
