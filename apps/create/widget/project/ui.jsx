const tabs = {
  metadata: {
    widget: "/*__@appAccount__*//widget/project.metadata",
  },
  template: {
    widget: "/*__@appAccount__*//widget/project.template",
  },
  settings: {
    widget: "/*__@appAccount__*//widget/project.settings",
  },
};

State.init({
  tab: "template",
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Open Sans", sans-serif;

  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 8px;
  min-width: 240px;
  width: 240px;
  padding: 40px 17px 30px;
  z-index: 1;
  bottom: 0;
  margin-bottom: 40px;
  height: fit-content;

  @media (max-width: 800px) {
    width: 100%;
  }

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #999;
    padding: 6px 21px;
  }

  a {
    display: block;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 21px;
    border-radius: 4px;
    color: #141414;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    text-transform: capitalize;
  }

  a.active {
    background: #edf4fc !important;
    color: #4498e0 !important;
  }

  a:hover {
    color: #4498e0 !important;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 20px;
  min-height: 70vh;
  margin-bottom: auto;

  @media (max-width: 800px) {
    width: 100%;
    padding: 0;
    margin: 0;
  }
`;

return (
  <Wrapper>
    <Sidebar>
      {tabs &&
        Object.keys(tabs)?.map((t, i) => (
          <a
            href="#"
            className={state.tab === t ? "active" : ""}
            onClick={() => State.update({ tab: t })}
          >
            {t}
          </a>
        ))}
    </Sidebar>
    <Content><Widget src={tabs[state.tab].widget} props={props} /></Content>
  </Wrapper>
);
