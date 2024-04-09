const accountId = props.accountId ?? context.accountId;
const communityId = props.communityId ?? "multi.sputnik-dao.near";

const tab = props.tab === "following" ? props.tab : "members";

const Wrapper = styled.div`
  --section-gap: 23px;
  padding-top: 42px;

  @media (max-width: 1155px) {
    .line-rounded-corners {
      display: none !important;
    }
  }

  @media (max-width: 998px) {
    padding-top: 0;
  }
`;

const H1 = styled.h1`
  font-family: ${props.h1Font ?? "sans-serif"};
  font-style: normal;
  font-weight: 500;
  font-size: ${props.h1FontSize ?? "90px"};
  line-height: 1;
  text-align: center;
  letter-spacing: -0.03em;
  color: ${props.h1Color ?? "#000"};
  margin: 0;
  max-width: 700px;

  @media (max-width: 900px) {
    font-size: 50px;
  }
`;

const H2 = styled.h1`
  font-family: ${props.h2Font ?? "sans-serif"};
  font-style: normal;
  font-weight: 500;
  font-size: ${props.h2FontSize ?? "90px"};
  line-height: 1;
  text-align: center;
  letter-spacing: -0.03em;
  color: ${props.h2Color ?? "#fff"};
  margin: 0;
  max-width: 700px;

  span {
    display: inline-block;
    background: ${props.bgColor ?? "#000"};
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
  font-family: ${props.taglineFont ?? "sans-serif"};
  font-size: ${(p) => p.size ?? "21px"};
  line-height: ${(p) => p.lineHeight ?? "1.5"};
  font-weight: ${(p) => p.weight ?? "400"};
  color: ${(p) => p.color ?? "#000"};
  margin: 0;
  max-width: 670px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HiddenText = styled.p`
  font-family: "Courier", sans-serif;
  font-size: ${(p) => p.size ?? "23px"};
  line-height: ${(p) => p.lineHeight ?? "1.5"};
  font-weight: ${(p) => p.weight ?? "400"};
  color: ${(p) => p.color ?? "#000"};
  margin: 0;
  max-width: 670px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Flex = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-direction: column;
  flex-wrap: "nowrap";

  @media (max-width: 998px) {
    flex-direction: column;
    gap: var(--section-gap);
  }
`;

const Container = styled.div`
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  gap: var(--section-gap);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--section-gap) 24px;

  @media (max-width: 768px) {
    padding: var(--section-gap) 12px;
  }
`;

return (
  <Wrapper>
    <Container>
      <Flex>
        <div>
          <H1>Build</H1>
          <H2>
            <span>City</span>
          </H2>
        </div>
        <div className="mt-3">
          <Text style={{ maxWidth: "350px" }}>
            {props.tagline ?? "creating better cities"}
          </Text>
        </div>
        {context.accountId && (
          <div className="m-3" style={{ maxWidth: "75%" }}>
            <Widget
              src="near/widget/DIG.Button"
              props={{
                href: `${props.link ?? "#/hack.near/widget/docs"}`,
                label: `${props.buttonText ?? "Get Started"}`,
                variant: "outline-dark",
                size: "large",
              }}
            />
          </div>
        )}
      </Flex>
    </Container>
    <div className="m-2">
      <Widget
        src="hack.near/widget/dao.people"
        props={{ daoId: communityId }}
      />
    </div>
    <br />
    <br />
    <Flex>
      <Text
        size="14px"
        weight="600"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.17em",
          textAlign: "center",
        }}
      >
        Made Possible by Collaboration
      </Text>
      <Widget src="hack.near/widget/dev.Badge" />
    </Flex>
  </Wrapper>
);
