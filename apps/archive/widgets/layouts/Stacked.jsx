const { Top, Bottom } = props;

const Stacked = styled.div`
  width: 100%;
  height: 100%;

  .top {
    height: 50%;
  }

  .bottom {
    height: 50%;
  }
`;

return (
  <Stacked>
    <div className="top">
      <Top />
    </div>
    <div className="bottom">
      <Bottom />
    </div>
  </Stacked>
);
