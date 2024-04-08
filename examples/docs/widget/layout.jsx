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
  const { Header, Footer, Sidebar } = blocks;

  Header = Header ? Header : () => <></>;
  Footer = Footer ? Footer : () => <></>;
  Sidebar = Sidebar ? Sidebar : () => <></>;

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
            <div className="children">
              <Sidebar />
            </div>
            <div className="children">{children}</div>
          </SplitLayout>
          <Footer />
        </StandardLayout>
      );
  }
};

return { Layout };
