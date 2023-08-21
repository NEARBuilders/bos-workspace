const DocumentItem = ({
  key,
  depth,
  handleDocumentClick,
  handleCreateDocument,
  handleDeleteDocument,
  children,
}) => {
  const toggleExpand = () => {
    State.update({ isExpanded: !state.isExpanded });
  };

  return (
    <div key={key}>
      <StyledDocumentItem depth={depth}>
        {children && (
          <Button onClick={toggleExpand}>{state.isExpanded ? "-" : "+"}</Button>
        )}
        <div onClick={handleDocumentClick}>{key}</div>
        <div>
          <Button onClick={handleCreateDocument}>create</Button>
          <Button onClick={handleDeleteDocument}>delete</Button>
        </div>
      </StyledDocumentItem>
      {state.isExpanded && children}
    </div>
  );
};

const StyledDocumentItem = styled.div`
  cursor: pointer;
  padding: 5px;
  padding-left: ${(props) => props.depth * 20}px;
  margin: 5px 0;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button``;

return DocumentItem(props);
