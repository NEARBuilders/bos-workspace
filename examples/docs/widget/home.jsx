const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const BosWorkspaceInfo = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #444;
  margin: 2rem;
`;

const CodeSnippet = styled.div`
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
`;

return (
  <LandingPageContainer>
    <Title>bos-workspace</Title>
    <BosWorkspaceInfo>
      bos-workspace is a comprehensive toolset designed to simplify the
      development and deployment of NEAR components and applications. With
      support for hot reload, TypeScript, and multiple app management, it caters
      to developers looking for an efficient and scalable developer environment.
    </BosWorkspaceInfo>
    <Title>Quickstart</Title>
    <BosWorkspaceInfo>
      To begin, either use this template repository or install bos-workspace
      within an existing project:
    </BosWorkspaceInfo>
    <CodeSnippet>yarn add -D bos-workspace</CodeSnippet>
    <BosWorkspaceInfo>
      Then, you can clone widgets from an existing account via:
    </BosWorkspaceInfo>
    <CodeSnippet>bos-workspace clone [accountId]</CodeSnippet>
    <BosWorkspaceInfo>
      Or ensure the proper workspace structure and usage.
    </BosWorkspaceInfo>
  </LandingPageContainer>
);
