let { theme } = props.theme;
let { variables } = props.variables;

if (!variables) {
  variables = `
      --main-color: rgb(68, 152, 224);
  `;
}

if (!theme) {
  theme = `

    [navbar] {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 60px;

      [left] {
        display: flex;
        align-items: center;
        height: 100%;
      }

      [logo] {
        font-size: 27px;
        font-weight: 100;
        letter-spacing: -1px;
        color: #000;
        display: flex;
        align-items: center;
        text-decoration: none;
        gap: 10px;

        img {
          height: 40px;
          width: 40px;
          object-fit: contain;
          margin-right: 16px;
        }
      }
    }

    [container] {
      border-radius: 10px;
      box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;
      margin: 20px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
    }

    [sidebar] {
      padding: 20px;
      border-right: 1px solid #eee;
      min-height: calc(100vh - 60px);
      overflow: auto;
      box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;
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

        a {
          display: block;
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
    }
  `;
}

const Root = styled.div`
  ${variables}
  ${theme}
`;

function Template(p) {
  const { goTo, title, description, logo, tags, documents, content } = p;

  return (
    <Root>
      <Navbar {...p} />
      <div container="">
        <div sidebar="">
          <DocumentTree {...p} />
        </div>
        <div content="">
          <Content {...p} />
        </div>
      </div>
    </Root>
  );
}

function Navbar({ logo, title, goTo }) {
  return (
    <div navbar="">
      <div left="">
        <a
          onClick={() =>
            goTo({
              page: "home",
            })
          }
          logo=""
        >
          <img src={logo} height={50} width={50} alt="logo" />
          <span>
            <b>{title}</b>
          </span>
        </a>
      </div>
      <div right="">
        {/* Menu should come from project thing */}
        {/* <a href="/about">About</a>
        <a href="/contact">Contact</a> */}
      </div>
    </div>
  );
}

function DocumentTree({ documents, goTo, activeDocument }) {
  return (
    <ul tree="">
      {Object.entries(documents).map(([id, { title, children }]) => {
        return (
          <li key={id} active={activeDocument === id ? "" : undefined}>
            <a onClick={() => goTo({ document: id })}>{title}</a>
            {children && (
              <DocumentTree
                documents={children}
                goTo={goTo}
                activeDocument={activeDocument}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Content({ content }) {
  return (
    <div content="">
      {/* <Markdown text={content} /> */}
      <Widget
        src={`openwebbuild.near/widget/Post.Markdown`}
        props={{ text: content }}
      />
    </div>
  );
}

return Template(props);
