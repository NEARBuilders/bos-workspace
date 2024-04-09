const accountId = props.accountId ?? context.accountId;

const creatorId = props.creatorId ?? "hack.near";
const pageId = props.pageId ?? "community.page";

return (
  <>
    <Widget
      src={`${creatorId}/widget/${pageId}`}
      props={{
        accountId,
        communityId: "every.near",
        contractId: "mint.sharddog.near",

        h1: "EVERY",
        h2: "ONE",

        tagline: "Build Community Pages",
        taglineFont: "Courier",

        h1Color: "#000",
        h1Font: "Courier",
        h1FontSize: "89px",

        h2Color: "#fff",
        h2Font: "Courier",
        h2FontSize: "89px",
        bgColor: "#000",

        buttonText: "View Template",
        link: "#/hack.near/widget/community.page",
      }}
    />
  </>
);
ine-block;
    background: #efa9ca;
    border-radius: 20px;
    position: relative;
    padding: 0.1em 0.2em 0;

    svg {
      position: absolute;
      bottom: -8px;
      right: -10px;
      width: 24px;
    }
  }

  @media (max-width: 900px) {
    font-size: 50px;

    span {
      border-radius: 12px;
      svg {
        position: absolute;
        bottom: -6px;
        right: -7px;
        width: 16px;
      }
    }
  }
`;

const Text = styled.p`
  font-family: "FK Grotesk", sans-serif;
  font-size: ${(p) => p.size ?? "18px"};
  line-height: ${(p) => p.lineHeight ?? "1.5"};
  font-weight: ${(p) => p.weight ?? "400"};
  color: ${(p) => p.color ?? "#000"};
  margin: 0;
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

  ${(p) =>
    p.mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
      gap: var(--section-gap);
    }
  `}
`;

const Content = styled.div`
  @media (max-width: 1200px) {
    > div:first-child {
    }
  }
`;

const Container = styled.div`
  display: flex;
  max-width: 1060px;
  margin: 0 auto;
  gap: ${(p) => p.gap ?? "var(--section-gap)"};
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : undefined)};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
  padding: var(--section-gap) 23px;
`;

return (
  <Wrapper>
    {!isOwner && (
      <Container center>
        <Flex gap="23px" direction="column" alignItems="center">
          <H1>
            <span>
              NDC{" "}
              <svg viewBox="0 0 26 24" fill="none" aria-hidden="true">
                <path
                  d="M24.3767 8.06326L1.51965 0.0649912C1.10402 -0.0830767 0.639031 0.026026 0.327308 0.340346C0.0181841 0.657263 -0.0831256 1.12225 0.0701378 1.53788L8.071 23.2519C8.23726 23.7013 8.66587 24 9.14385 24H9.14644C9.62702 24 10.0556 23.6961 10.2167 23.2441L13.734 13.495L24.3325 10.2349C24.8053 10.0895 25.13 9.65824 25.1378 9.16468C25.1482 8.67112 24.8391 8.22691 24.3715 8.06326H24.3767Z"
                  fill="#3782b5"
                />
              </svg>
            </span>
            Work Groups
          </H1>
        </Flex>
      </Container>
    )}

    <Container>
      {!isOwner ? (
        <Flex gap="23px" direction="column" alignItems="center">
          {!accountId ? (
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "https://shard.dog/ndcconstellation",
                label: "Create Account",
                variant: "outline-dark",
                size: "large",
              }}
            />
          ) : (
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: "https://shard.dog/ndcconstellation",
                label: "Get Your NFT",
                variant: "outline-primary",
                size: "large",
              }}
            />
          )}
        </Flex>
      ) : (
        <Content>
          <Widget src="devs.near/widget/community.Groups" />
        </Content>
      )}
    </Container>
    <Container>
      <Flex gap="23px" direction="column" alignItems="center">
        <Text
          size="14px"
          weight="600"
          style={{ textTransform: "uppercase", letterSpacing: "0.17em" }}
        >
          Made Possible by{" "}
          <a href="https://near.org/blog/what-is-the-near-digital-collective">
            NDC
          </a>
          <Widget src="hack.near/widget/dev.Badge" />
        </Text>
      </Flex>
    </Container>
  </Wrapper>
);
