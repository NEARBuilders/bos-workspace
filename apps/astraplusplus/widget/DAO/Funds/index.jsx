const widgetOwner = props.widgetOwner || "/*__@appAccount__*/";
const daoId = props.daoId;

const baseApi = "https://api.pikespeak.ai";
const publicApiKey = "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5";

const fetchApiConfig = {
  mode: "cors",
  headers: {
    "x-api-key": publicApiKey,
  },
};

const constructURL = (baseURL, paramObj) => {
  let params = "";
  for (const [key, value] of Object.entries(paramObj ?? {})) {
    params += `${key}=${value}&`;
  }
  params = params.slice(0, -1);
  return `${baseURL}?${params}`;
};

const fether = {
  balances: (accounts) => {
    return fetch(
      constructURL(`${baseApi}/account/balances`, { accounts }),
      fetchApiConfig
    );
  },
  near_transfers: (account, limit, offset, minamount) => {
    return fetch(
      constructURL(`${baseApi}/account/near-transfer/${account}`, {
        offset,
        limit,
        minamount,
      }),
      fetchApiConfig
    );
  },
  ft_transfers: (account, limit, offset) => {
    return fetch(
      constructURL(`${baseApi}/account/ft-transfer/${account}`, {
        offset,
        limit,
      }),
      fetchApiConfig
    );
  },
  outgoing_near: (account) => {
    return fetch(
      constructURL(`${baseApi}/account/outgoing-near/${account}`),
      fetchApiConfig
    );
  },
};

const Container = styled.div``;

return (
  <Container className="d-flex flex-column gap-4">
    <Widget
      src={`${widgetOwner}/widget/DAO.Funds.Balance`}
      props={{ daoId, fether }}
    />
    <Widget
      src={`${widgetOwner}/widget/DAO.Funds.Transactions`}
      props={{ daoId, fether }}
    />
    {/* <Widget
      src={`${widgetOwner}/widget/DAO.Funds.Outgoing`}
      props={{ daoId, fether }}
    /> */}
  </Container>
);
