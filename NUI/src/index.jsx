const NDCUI_ACCOUNT = props.NDCUI_ACCOUNT ?? "nui.sking.near";
if (!NDCUI_ACCOUNT) return "";

State.init({
  widget: state.widget ?? props.widget ?? "overview",
});

const data = Social.keys(`${NDCUI_ACCOUNT}/widget/*`, "final", {
  return_type: "BlockHeight",
});

if (!data) return "";

function convertToNestedObject(obj) {
  const result = {};
  Object.keys(obj)
    .filter((key) => key !== "index")
    .forEach((key) => {
      let parts = key.split(".");
      let firstPart = parts.shift();
      if (parts[1] === "demo") {
        return;
      }
      if (parts.length) {
        result[firstPart] = result[firstPart] || {};
        result[firstPart][parts.join(".")] = obj[key];
      } else {
        result[firstPart] = obj[key];
      }
    });
  return result;
}

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

// const mock = {
//   index: 0,
//   "Data.ChartJs": 0,
//   "Data.Balances": 0,
//   "Data.Balances.demo": 0,
//   "Typography.OpenSansFont": 0,
//   "Typography.Text": 0,
//   "Typography.Text.demo": 0,
//   "Navigation.Paginate": 0,
//   "Feedback.Spinner": 0,
//   "Feedback.Skeleton": 0,
//   "Feedback.Skeleton.demo": 0,
//   "Input.Select": 0,
//   "Navigation.PrevNext": 0,
//   "Element.Token": 0,
//   "Input.Button": 0,
//   "Input.Button.demo": 0,
//   "Layout.Modal": 0,
//   "Layout.Header": 0,
//   "Element.User": 0,
//   "Element.User.demo": 0,
//   "Input.Text": 0,
//   "Input.Text.demo": 0,
//   "Input.Checkbox": 0,
//   "Input.Checkbox.demo": 0,
//   "Social.FollowButton": 0,
//   overview: 0,
// };
const widgets = mock ?? data[NDCUI_ACCOUNT].widget;
const widgetsObj = convertToNestedObject(widgets);

const tabContent = () => {
  const hasDemo = widgets[`${state.widget}.demo`] !== undefined;
  return (
    <Content className="container">
      <div>
        <Widget
          src={`${NDCUI_ACCOUNT}/widget/${state.widget}${
            hasDemo ? ".demo" : ""
          }`}
          props={{
            demoMode: true,
          }}
        />
      </div>
    </Content>
  );
};

const widgetsKeys = Object.keys(widgetsObj)
  .sort((a, b) => {
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    return 0;
  })
  .sort((a, b) => {
    if (typeof widgetsObj[a] === "object") return 1;
    return -1;
  });
return (
  <Wrapper>
    <Sidebar>
      {widgetsKeys.map((folder) => {
        if (typeof widgetsObj[folder] !== "object") {
          return (
            <a
              href={`#/${NDCUI_ACCOUNT}/widget/index?widget=${folder}`}
              onClick={() => {
                State.update({
                  widget: folder,
                });
              }}
              className={state.widget === folder ? "active" : ""}
            >
              {folder}
            </a>
          );
        }
        return (
          <div>
            <h3>{folder}</h3>
            {Object.keys(widgetsObj[folder])
              .sort((a, b) => {
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                return 0;
              })
              .map((widget) => {
                const fullWidgetName = `${folder}.${widget}`;
                return (
                  <a
                    href={`#/${NDCUI_ACCOUNT}/widget/index?widget=${fullWidgetName}`}
                    onClick={() => {
                      State.update({
                        widget: fullWidgetName,
                      });
                    }}
                    className={state.widget === fullWidgetName ? "active" : ""}
                  >
                    {widget}
                  </a>
                );
              })}
          </div>
        );
      })}
    </Sidebar>
    {tabContent()}
    <Widget src={`${NDCUI_ACCOUNT}/widget/Typography.OpenSansFont`} />
  </Wrapper>
);
