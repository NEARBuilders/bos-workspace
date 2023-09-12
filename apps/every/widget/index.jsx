function Content() {
  const randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const randomFontSize = () => {
    const minSize = 24;
    const maxSize = 128;
    return Math.floor(Math.random() * (maxSize - minSize + 1) + minSize) + "px";
  };

  const randomFontFamily = () => {
    const fonts = [
      "Georgia",
      "Times New Roman",
      "Times",
      "Palatino Linotype",
      "Book Antiqua",
      "Palatino",
      "Arial",
      "Helvetica",
      "Arial Black",
      "Gadget",
      "Comic Sans MS",
      "cursive",
      "Impact",
      "Charcoal",
      "Lucida Sans Unicode",
      "Lucida Grande",
      "Tahoma",
      "Geneva",
      "Trebuchet MS",
      "Helvetica Neue",
      "Verdana",
      "Geneva",
      "Courier New",
      "Courier",
      "Lucida Console",
      "Monaco",
    ];
    return fonts[Math.floor(Math.random() * fonts.length)];
  };

  const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-family: ${randomFontFamily()};
    font-size: ${randomFontSize()};
    color: ${randomColor()};
  `;

  return <StyledDiv>everything</StyledDiv>;
}

return (
  <Widget
    src="devs.near/widget/ContextMenu" // provider
    props={{
      // path,
      // handler
      Item: () => <Content />,
    }}
  />
);
