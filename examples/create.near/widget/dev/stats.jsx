const accountId = props.accountId ?? "hack.near";
const widgetName = props.widgetName ?? "DAO.Members";

const GRAPHQL_ENDPOINT = "https://near-queryapi.api.pagoda.co";
const STORE = "storage.googleapis.com";
const BUCKET = "databricks-near-query-runner";
const BASE_URL = `https://${STORE}/${BUCKET}/output/near_bos_component_details/component_rpc_loads`;
const dataset = `${BASE_URL}/${accountId}/widget/${widgetName}`;

const [developerSince, setDeveloperSince] = useState(undefined);
const [numberOfComponentsPublished, setNumberOfComponentsPublished] =
  useState(0);

const indexerQueries = `
  query GetWidgetCount {
   eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate(
      where: {account_id: {_eq: "${accountId}"}}
    ) {
      aggregate {
        count(distinct: true, columns: widget_name)
      }
    }
  }
  query GetDeveloperSince {
  eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate(
      where: {account_id: {_eq: "${accountId}"}}
    ) {
      aggregate {
        min {
          block_timestamp
        }
      }
    }
  }
`;

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "eduohe_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const Wrapper = styled.div`
  > div {
    padding-bottom: 32px;
    border-bottom: 1px solid #eceef0;
    margin-bottom: 32px;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  @media (max-width: 995px) {
    grid-row: 1;
  }
`;

const StatsContainer = styled.div`
  @media (max-width: 995px) {
    margin-top: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  padding-bottom: 25px;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
`;

const StatsBadge = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const Icon = styled.i`
  font-size: 15px;
  fill: currentColor;
  padding-right: 5px;
`;

useEffect(() => {
  fetchGraphQL(indexerQueries, "GetWidgetCount", {}).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("GetWidgetCount error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const noComponents =
          data
            .eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
            .aggregate.count;
        setNumberOfComponentsPublished(noComponents);
      }
    }
  });
}, []);

useEffect(() => {
  fetchGraphQL(indexerQueries, "GetDeveloperSince", {}).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("GetDeveloperSince error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (
        data &&
        data.eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
      ) {
        const developerSince =
          data
            .eduohe_near_nearcon_2023_widget_activity_feed_widget_activity_aggregate
            .aggregate.min.block_timestamp;
        setDeveloperSince(developerSince);
      }
    }
  });
}, []);

return (
  <Wrapper>
    <StatsContainer>
      <Container>
        <Stats>
          <StatsBadge>
            <Icon className="ph ph-code" />
            <span className="badge rounded-pill bg-secondary">
              {numberOfComponentsPublished
                ? numberOfComponentsPublished + " published"
                : "..."}
            </span>
          </StatsBadge>
          <StatsBadge>
            <Icon className="bi bi-calendar" />
            <span className="badge rounded-pill bg-secondary">
              {developerSince ? (
                <Widget
                  key="foo"
                  src="near/widget/TimeAgo"
                  props={{
                    alwaysRelative: true,
                    blockTimestamp: developerSince,
                  }}
                />
              ) : (
                <span>...</span>
              )}
            </span>
          </StatsBadge>
        </Stats>
      </Container>
    </StatsContainer>
  </Wrapper>
);
