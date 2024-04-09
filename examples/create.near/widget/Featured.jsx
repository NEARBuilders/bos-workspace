const profileUrl =
  "/#/adminalpha.near/widget/ProfilePage?accountId=borderlesscommunity.near";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Item = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TextLink = styled.a`
  color: #006adc;
  outline: none;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;

  &:hover,
  &:focus {
    color: #006adc;
    text-decoration: underline;
  }
`;

return (
  <Wrapper>
    <Header>
      <H2>Featured</H2>
      <TextLink href={profileUrl}>More Info</TextLink>
    </Header>

    <Items>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "minorityprogrammers.near/widget/genadropMinter" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "mintbase.near/widget/nft-marketplace" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{ src: "mintbase.near/widget/ListToMarket" }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{
            src: "rub3n.near/widget/NearNFTActivity",
          }}
        />
      </Item>
      <Item>
        <Widget
          src="adminalpha.near/widget/ComponentCard"
          props={{
            src: "9c461db4ac11b66ed1167ff969042ac278eaf2d571712585424be00171a63884/widget/NFT-Collection-Holder-Snapshot",
          }}
        />
      </Item>
    </Items>
  </Wrapper>
);
