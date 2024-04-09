const { items, handleItemClick, project } = props;

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
  border: 2px solid #6C5F5B; 

  &:hover {
    background-color: var(--paper);
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

function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

return (
  <Container>
    {items.map((item, index) => (
      <Link
        to={`/create.near/widget/app?project=${normalizeString(
          item.metadata.name
        )}`}
      >
        <StyledItem
          key={index}
          onClick={() => handleItemClick(item)}
          style={{
            backgroundColor:
              normalizeString(item.metadata.name) === project
                ? "var(--paper)"
                : "var(--base100)",
          }}
        >
          <ImageWrapper>
            <Image src={item.metadata.image.href} alt={item.metadata.name} />
          </ImageWrapper>
          <Name>{item.metadata.name}</Name>
        </StyledItem>
      </Link>
    ))}
  </Container>
);
