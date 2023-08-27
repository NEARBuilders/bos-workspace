const { project, handle } = props;

const temps = [
  {
    src: "/*__@appAccount__*//widget/templates.project.doc",
    preview:
      "https://ipfs.near.social/ipfs/bafkreiepqmctupqt5irsqoqgchoqmfm76xofaxzvauv3canfehyqgeeafy",
    name: "Documentation Website",
    theme: `[navbar] {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 70px;
        border-bottom: 1px solid #ccc;
      
        [left] {
          display: flex;
          align-items: center;
          height: 100%;
        }
      
        [logo] {
          font-size: 17px;
          font-weight: 100;
          letter-spacing: -1px;
          color: #000;
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 10px;
      
          img {
            height: 26px !important;
            object-fit: contain;
            margin-right: 7px;
          }
      
          span {
            margin-bottom: -4px;
          }
        }
      
        [right] {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 20px;
        }
      
        [right] a {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 10px;
          color: #000;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }
      
        [right] a:hover {
          opacity: 0.8;
        }
      }
      
      [container] {
        border-radius: 10px;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
      }
      
      [sidebar] {
        padding: 20px;
        padding-left: 0;
        min-height: calc(100vh - 60px);
        overflow: auto;
        border-right: 1px solid #ccc;
        width: 300px;
      }
      
      [sidebar] > [tree] > li {
        padding-top: 12px;
        padding-left: 0 !important;
      }
      
      [tree] {
        padding: 0;
        margin: 0;
        list-style: none;
      
        li {
          padding: 0;
          margin: 0;
          list-style: none;
          padding-left: 16px;
      
          > [tree] {
            display: none;
          }
      
          &[expanded] {
            > [tree] {
              display: block;
            }
          }
      
          a {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            padding: 6px 21px;
            border-radius: 4px;
            color: rgb(20, 20, 20);
            cursor: pointer;
            transition: all 0.2s ease-in-out 0s;
            text-decoration: none;
            text-transform: capitalize;
            position: relative;
            margin-bottom: 4px;
      
            &:after {
              content: "";
              position: absolute;
              z-index: -1;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
              background: transparent;
              opacity: 0.1;
              transition: all 0.2s ease-in-out 0s;
              border-radius: 4px;
            }
      
            &:hover {
              color: var(--main-color);
              &:after {
                background: var(--main-color);
              }
            }
          }
      
          &[active] {
            > a {
              color: var(--main-color);
              &:after {
                background: var(--main-color);
              }
            }
          }
        }
      }
      
      [content] {
        padding: 20px;
        flex: 1;
        overflow: auto;
      
        a {
          background: transparent;
        }
      
        a:active,
        a:hover {
          outline: 0;
        }
      
        strong {
          font-weight: bold;
        }
      
        h1 {
          font-size: 2em;
          margin: 0.67em 0;
        }
      
        img {
          border: 0;
        }
      
        hr {
          -moz-box-sizing: content-box;
          box-sizing: content-box;
          height: 0;
        }
      
        pre {
          overflow: auto;
        }
      
        code,
        kbd,
        pre {
          font-family: monospace, monospace;
          font-size: 1em;
        }
      
        input {
          color: inherit;
          font: inherit;
          margin: 0;
        }
      
        html input[disabled] {
          cursor: default;
        }
      
        input {
          line-height: normal;
        }
      
        input[type="checkbox"] {
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0;
        }
      
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
      
        td,
        th {
          padding: 0;
        }
      
        * {
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
      
        a {
          color: #4183c4;
          text-decoration: none;
        }
      
        a:hover,
        a:focus,
        a:active {
          text-decoration: underline;
        }
      
        hr {
          height: 0;
          margin: 15px 0;
          overflow: hidden;
          background: transparent;
          border: 0;
          border-bottom: 1px solid #ddd;
        }
      
        hr:before {
          display: table;
          content: "";
        }
      
        hr:after {
          display: table;
          clear: both;
          content: "";
        }
      
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 15px;
          margin-bottom: 15px;
          line-height: 1.1;
        }
      
        h1 {
          font-size: 30px;
        }
      
        h2 {
          font-size: 21px;
        }
      
        h3 {
          font-size: 16px;
        }
      
        h4 {
          font-size: 14px;
        }
      
        h5 {
          font-size: 12px;
        }
      
        h6 {
          font-size: 11px;
        }
      
        blockquote {
          margin: 0;
        }
      
        ul,
        ol {
          padding: 0;
          margin-top: 0;
          margin-bottom: 0;
        }
      
        ol ol,
        ul ol {
          list-style-type: lower-roman;
        }
      
        ul ul ol,
        ul ol ol,
        ol ul ol,
        ol ol ol {
          list-style-type: lower-alpha;
        }
      
        dd {
          margin-left: 0;
        }
      
        code {
          font:
            12px Consolas,
            "Liberation Mono",
            Menlo,
            Courier,
            monospace;
        }
      
        pre {
          margin-top: 0;
          margin-bottom: 0;
          font:
            12px Consolas,
            "Liberation Mono",
            Menlo,
            Courier,
            monospace;
        }
      
        .anchor {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: block;
          padding-right: 6px;
          padding-left: 30px;
          margin-left: -30px;
        }
      
        .anchor:focus {
          outline: none;
        }
      
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          position: relative;
          margin-top: 1em;
          margin-bottom: 16px;
          font-weight: bold;
          line-height: 1.4;
        }
      }`,
  },
];

console.log(project);

const selectedTemp = temps.find((t) => t.src == project.templateSrc);
State.init({
  selected: selectedTemp ? temps.indexOf(selectedTemp) : project.templateSrc,
});

const Wrapper = styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    grid-gap: 1rem;
    list-style: none;
    padding: 0;
  }
  li {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
    overflow: hidden;

    .img {
      border-radius: 4px;
      object-fit: cover;
      width: 100%;
      height: 160px;
      background-color: #eee;
      margin-bottom: 0.5rem;
    }
  }
  li.active {
    border-color: rgb(68, 152, 224) !important;
  }
`;

function renderTemplate() {
  return (
    <Wrapper>
      <h2>Select a template</h2>
      <p>
        Choose a template from the available options. You can also have a custom
        template by entering the src of the template.
      </p>
      <p>
        Template:
        <input
          type="text"
          value={
            typeof state.selected === "string"
              ? state.selected
              : temps[state.selected].src
          }
          onChange={(e) => {
            State.update({
              selected: e.target.value,
            });
          }}
        />
      </p>
      <ul>
        {temps.map((t, i) => {
          return (
            <li
              onClick={() => {
                State.update({
                  selected: i,
                });
              }}
              className={state.selected == i ? "active" : ""}
            >
              {t.preview ? (
                <img className="img" src={t.preview} height={100} width={161} />
              ) : (
                <div className="img"></div>
              )}
              {t.name}
              <br />
              <b>
                <small>{t.src}</small>
              </b>
            </li>
          );
        })}
      </ul>
      <Widget
        src="/*__@replace:nui__*//widget/Input.Button"
        props={{
          variant: "success",
          children: <>Save</>,
          onClick: () => {
            const temp =
              typeof state.selected === "string"
                ? { src: state.selected }
                : temps[state.selected];
            handle["project"].update(project.id, {
              template: {
                src: temp.src,
              },
            });
          },
          disabled:
            state.selected == temps.indexOf(selectedTemp) ||
            state.selected == project.templateSrc,
        }}
      />
    </Wrapper>
  );
}

let theme;
if (project.theme) {
  theme = project.theme;
} else {
  theme = selectedTemp.theme;
}

function renderTheme() {
  if (theme === null) return "";

  return (
    <Wrapper className="mt-4">
      <h2>Theme</h2>
      <p>Edit the theme of the template.</p>
      <textarea
        key={selectedTemp}
        style={{ width: "100%", height: "400px" }}
        defaultValue={theme}
        onChange={(e) => {
          State.update({
            theme: e.target.value,
          });
        }}
      />
      <Widget
        src="/*__@replace:nui__*//widget/Input.Button"
        props={{
          variant: "success",
          children: <>Save Theme</>,
          disabled: !state.theme,
          onClick: () => {
            handle["project"].update(project.id, {
              template: {
                theme: state.theme,
              },
            });
          },
        }}
      />
    </Wrapper>
  );
}

return (
  <>
    {renderTemplate()}
    {renderTheme()}
  </>
);
