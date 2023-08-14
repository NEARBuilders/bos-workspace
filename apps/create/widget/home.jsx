const Root = styled.div`
  min-height: max(300px, 80vh);
  width: 100%;
  border: 1px solid #eaecef;
  border-radius: 16px;
  background-color: /*__@replace:colors.background__*/;
  color: /*__@replace:colors.text__*/;
`;

return (
  <Root>
    <Widget src="/*__@appAccount__*//widget/Common.Layout.Sidebar" />
  </Root>
);
