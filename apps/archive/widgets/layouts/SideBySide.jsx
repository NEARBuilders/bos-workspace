const { Left, Right } = props;

const SideBySide = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  .left {
    width: 50%;
  }

  .right {
    width: 50%;
  }
`;

return (
  <SideBySide>
    <div className="left">
      <Left />
    </div>
    <div className="right">
      <Right />
    </div>
  </SideBySide>
);
