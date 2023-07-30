const fontCss = fetch(
  "https://fonts.googleapis.com/css?family=Open%20Sans"
).body;

if (!fontCss) {
  return;
}

const Theme = styled.div`
  * {
    font-family: "Open Sans", sans-serif;
  }
  ${fontCss}
`;

return <Theme />;
