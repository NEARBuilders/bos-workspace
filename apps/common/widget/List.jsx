const { items, Container, Item, Empty } = props;

if (!items) {
  return Empty ? <Empty /> : <div>none</div>;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = ({ key, data }) => {
  return <div>{key} : {JSON.stringify(data)}</div>;
}

ListContainer = Container ? Container : ListContainer;
ListItem = Item ? Item : ListItem;

return (
  <ListContainer>
    {items.map((item, index) => (
      <ListItem key={index} data={item} />
    ))}
  </ListContainer>
);

// return { List };
