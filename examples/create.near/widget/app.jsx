const project = props.project;

let theme = props.theme;
let variables = props.variables;

if (!variables) {
  variables = `
  --black: #100f0f;
  --base950: #4F4A45;
  --base900: #282726;
  --base850: #343331;
  --base800: #403e3c;
  --base700: #575653;
  --base600: #6f6e69;
  --base500: #878580;
  --base300: #b7b5ac;
  --base200: #cecdc3;
  --base150: #dad8ce;
  --base100: #e6e4d9;
  --base50: #f2f0e5;
  --paper: #F6F1EE;
  `;
}

if (!theme) {
  theme = ``;
}

const Root = styled.div`
  ${variables}
  ${theme}

  a {
    text-decoration: none;
    color: var(--base900);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: var(--base950);
`;

return (
  <Root>
    <Container>
      <Widget
        src="create.near/widget/providers.project"
        props={{
          project,
          children: (p) => {
            return (
              <Widget
                src="create.near/widget/blocks.container"
                props={{ ...p, project }}
              />
            );
          },
        }}
      />
    </Container>
  </Root>
);
