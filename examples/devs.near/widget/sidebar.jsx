const { handleItemClick } = props;

const Container = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const StyledItem = styled.div`
  display: flex;
  border-radius: 8px;
  background-color: var(--base100);
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  cursor: pointer;
  &:hover {
    background-color: var(--base50);
  }
`;

const ImageWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Name = styled.div`
  flex: 1;
  align-self: center;
`;

const items = Social.keys(`${context.accountId}/widget/*`, "final");

if (!items) {
  return <div>No items found</div>;
}

items = Object.keys(items[context.accountId].widget);

return (
  <Container>
    {items.map((item, index) => (
      <StyledItem key={index} onClick={() => handleItemClick(`${context.accountId}/widget/${item}`)}>
        {/* <ImageWrapper>
          <Image src={item.metadata.image.href} alt={item.metadata.name} />
        </ImageWrapper> */}
        <Name>{item}</Name>
      </StyledItem>
    ))}
  </Container>
);
