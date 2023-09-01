const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  background-color: red;
  height: 20px;
`;
const Content = styled.div`
  flex-grow: 1;
  background-color: blue;
`;
const Footer = styled.div`
  background-color: red;
  height: 20px;
`;

function App() {
  return (
    <Container>
      <Header />
      <Content />
      <Footer />
    </Container>
  );
}

const Row = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Column = styled.div`
  flex: 1;
  height: 100%;
  flex-grow: 1;
`;

const Sidebar = styled.div`
  background-color: red;
  width: 60px;
  height: 100%;
`;

const MainContent = styled.div`
  height: 100%;
  width: 100%;
  background-color: blue;
`;

function Dashboard() {
  return (
    <Row>
      <Column>
        <Sidebar />
      </Column>
      <Column>
        <MainContent />
      </Column>
    </Row>
  );
}

const SplitScreen = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
`;

const LeftPanel = styled.div`
  flex-grow: 1;
  background-color: blue;
`;
const RightPanel = styled.div`
  flex-grow: 1;
  background-color: red;
`;

function SplitLayout() {
  return (
    <SplitScreen>
      <LeftPanel />
      <RightPanel />
    </SplitScreen>
  );
}

// const TabContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   width: 100%;
// `;

// This one will not work as a template unless we don't use state, maybe.
// function TabbedComponent() {
//   State.init({ activeTab: "home"});
//   const [activeTab, setActiveTab] = useState("home");

//   return (
//     <TabContainer>
//       <Tabs activeTab={state.activeTab} onTabChange={(setActiveTab)} />
//       {activeTab === "home" && <Home />}
//       {activeTab === "profile" && <Profile />}
//       {activeTab === "settings" && <Settings />}
//     </TabContainer>
//   );
// }

const FixedSidebarLayout = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

function Layout() {
  return (
    <FixedSidebarLayout>
      <Sidebar />
      <MainContent />
    </FixedSidebarLayout>
  );
}

const MasterLayout = () => {
  function setSelectedLayout(layout) {
    State.update({
      selectedLayout: layout,
    });
  }
  return (
    <div>
      <div>
        <button onClick={() => setSelectedLayout("SingleContainer")}>
          Single Container
        </button>
        <button onClick={() => setSelectedLayout("GridLayout")}>
          Grid Layout
        </button>
        <button onClick={() => setSelectedLayout("SplitScreen")}>
          Split Screen
        </button>
        {/* <button onClick={() => setSelectedLayout('TabbedComponent')}>Tabbed Navigation</button> */}
        <button onClick={() => setSelectedLayout("FixedSidebarLayout")}>
          Fixed Sidebar
        </button>
      </div>

      <div
        style={{
          height: "500px",
          width: "100%",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      >
        {state.selectedLayout === "SingleContainer" && <App />}
        {state.selectedLayout === "GridLayout" && <Dashboard />}
        {state.selectedLayout === "SplitScreen" && <SplitLayout />}
        {/* {selectedLayout === 'TabbedComponent' && <TabbedComponent />} */}
        {state.selectedLayout === "FixedSidebarLayout" && <Layout />}
      </div>
    </div>
  );
};

return <MasterLayout />;
