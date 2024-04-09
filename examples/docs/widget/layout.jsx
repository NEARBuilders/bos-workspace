const StandardLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SidebarLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  .aside {
    display: flex;
  }

  .main {
    flex-grow: 1;
  }
`;

const SplitLayout = styled.div`
  display: flex;
  width: 100%;

  .children {
    flex-grow: 1;
    flex-basis: 0;
  }
`;

const Layout = ({ variant, blocks, children }) => {
  const { Header, Footer, Sidebar, Left, Right } = blocks;

  Header = Header ? Header : () => <></>;
  Footer = Footer ? Footer : () => <></>;
  Sidebar = Sidebar ? Sidebar : () => <></>;
  Left = Left ? Left : ({ children }) => <>{children}</>;
  Right = Right ? Right : ({ children }) => <>{children}</>;

  if (!variant) {
    variant = "standard";
  }

  const availableVariants = ["standard", "sidebar", "split"];

  if (!availableVariants.includes(variant)) {
    return 'Invalid Variant: "' + variant + '"';
  }

  switch (variant) {
    case "standard":
      return (
        <StandardLayout>
          <Header />
          {children}
          <Footer />
        </StandardLayout>
      );
    case "sidebar":
      return (
        <StandardLayout>
          <Header />
          <SidebarLayout>
            <div className="aside">
              <Sidebar />
            </div>
            <div className="main">{children}</div>
          </SidebarLayout>
          <Footer />
        </StandardLayout>
      );
    case "split":
      return (
        <StandardLayout>
          <Header />
          <SplitLayout>
            <Sidebar />
            <div className="children">
              <Left>{children}</Left>
            </div>
            <div className="children">
              <Right>{children}</Right>
            </div>
          </SplitLayout>
          <Footer />
        </StandardLayout>
      );
  }
};

return { Layout };
