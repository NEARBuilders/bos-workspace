const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  overflow: auto;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (min-width: 600px) {
    gap: 20px;
  }
`;

const GridItem = styled.div`
  flex: 1 0 calc(33.333% - 10px); // Three per row by default

  @media (min-width: 600px) {
    flex: 1 0 calc(25% - 20px); // Four per row on wider screens
  }
`;

const Columns = styled.div`
  display: flex;
`;

const Column = styled.div`
  min-width: 200px;
  border-right: 1px solid #e0e0e0;
`;

const layout = props.layout || "LIST";
const data = Social.getr(props.path || context.accountId, "final");

if (!data) return <p>Loading...</p>;

State.init({
  activePath: [],
});

function setActivePath(v) {
  State.update({ activePath: v });
}

function RenderData({ data, layout }) {
  const handleColumnClick = (key) => {
    setActivePath([...state.activePath, key]);
  };

  switch (layout) {
    case "LIST":
      const dataList =
        state.activePath.length === 0 ? data : getNestedData(data, activePath);
      console.log(dataList);
      return (
        <>
          {Object.keys(dataList).map((key) => (
            <div key={key}>
              <Widget
                src="voyager3.near/widget/item"
                props={{
                  path: key,
                  data: dataList[key],
                }}
                loading={<></>}
              />
            </div>
          ))}
        </>
      );

    case "GRID":
      return (
        <Grid>
          {Object.keys(data).map((key) => (
            <GridItem key={key}>{key}</GridItem>
          ))}
        </Grid>
      );

    case "COLUMNS":
      return (
        <Columns>
          {state.activePath.map((pathKey, idx) => (
            <Column key={idx}>
              {Object.keys(
                getNestedData(data, state.activePath.slice(0, idx + 1))
              ).map((key) => (
                <div key={key} onClick={() => handleColumnClick(key)}>
                  {key}
                </div>
              ))}
            </Column>
          ))}
        </Columns>
      );

    default:
      return null;
  }
}

function getNestedData(data, pathArray) {
  return pathArray.reduce((currentData, key) => currentData[key] || {}, data);
}
return (
  <Content>
    <RenderData layout={layout} data={data} />
  </Content>
);
