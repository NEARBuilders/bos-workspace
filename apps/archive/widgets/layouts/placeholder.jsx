function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${getRandomColor()};
  display: flex;
  align-items: center;
  justify-content: center;
`;

return <Placeholder />;
