const data = Social.get(`${props.accountId}/**`, "final");

const StyledDiv = styled.div`
  text-align: left;
  cursor: pointer;
  padding: 10px;
  background-color: ${(props) =>
    props.isSelected
      ? "#d0d0d0"
      : "#f0f0f0"}; // Light gray for selected, lighter gray for others

  &:hover {
    background-color: #e0e0e0;
  }
`;

if (!data) {
  return <div>loading...</div>;
}

const handleClick = (key, value) => {
  State.update({ selectedKey: key });
  if (props.onSelect) {
    props.onSelect(key, value);
  }
};

return (
  <div>
    {Object.entries(data).map(([key, value]) => (
      <StyledDiv
        key={key}
        onClick={() => handleClick(key, value)}
        isSelected={key === state.selectedKey}
      >
        {key}
      </StyledDiv>
    ))}
  </div>
);
