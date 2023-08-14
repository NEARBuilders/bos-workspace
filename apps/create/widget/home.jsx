const Root = styled.div`
  min-height: max(300px, 80vh);
  width: 100%;
  border: 1px solid #eaecef;
  border-radius: 16px;
  background-color: #f9fbfe;
  color: #000;
  display: flex;
  gap: 1rem;

  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin: 1rem 1rem 1rem 0rem;
  }
  
  .header {
    padding: 1rem 0;
    width: 100%;
    background-color: #fff;
    border-radius: 16px;

    input {
      font-size: 28px;
      max-width: 680px;
      margin: 0 auto;
      background: none !important;
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
    }
  }

  .editor {
    width: 100%;
    background-color: #fff;
    border-radius: 16px;
    padding: 1rem 0;
  }
`;

return (
  <Root>
    <Widget src="/*__@appAccount__*//widget/Common.Layout.Sidebar" />
    <div className="right">
      <div className="header">
        <input type="text" placeholder="Untitled" />
      </div>
      <div className="editor">
        <Widget src="/*__@appAccount__*//widget/editor" />
      </div>
    </div>
  </Root>
);
