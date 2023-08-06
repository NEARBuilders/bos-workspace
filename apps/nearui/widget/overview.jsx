const BG = styled.div`
  background-color: #fff;
  background-image: linear-gradient(180deg, #fafcfd 0%, #b6dbfc 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
`;

const Circle1 = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: linear-gradient(90deg, #9333ea 0%, #f29bc0 100%), #03d69d;
  position: fixed;
  top: -100px;
  right: -100px;
  z-index: 0;
  opacity: 0.5;
  filter: blur(50px);
`;
const Circle2 = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 1px solid #cbcbcb;
  background: linear-gradient(90deg, #f9d74a 0%, #ffd50d 100%);
  position: fixed;
  top: 80px;
  right: -100px;
  z-index: 0;
  opacity: 0.8;
  filter: blur(100px);

  animation: move 3s ease infinite;

  @keyframes move {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(60px, 40px) scale(1.2);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const Card = styled.div`
  max-width: 900px;
  padding: 8rem 6rem;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.375);
  box-shadow: 0 0.75rem 2rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.125);
  position: relative;
  z-index: 1;
  margin: 40px auto;
  width: 100%;

  @media (max-width: 800px) {
    width: 100%;
    margin: 0;
    padding: 6rem 4rem;
  }

  h1 {
    font-size: 48px;
    font-weight: 800;
    font-family: "Mona Sans", sans-serif;
    letter-spacing: -1px;
    margin-bottom: 24px;
    display: block;
    margin-right: auto;
    text-align: center;

    background: linear-gradient(
      120deg,
      #ffd50d 0%,
      #f29bc0 25%,
      #4f46e5 50%,
      #f29bc0 75%,
      #ffd50d 100%
    );
    padding-right: 100px;
    color: #000;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 50s ease infinite;
  }

  @keyframes shine {
    0% {
      background-position: -1000px;
    }
    100% {
      background-position: 1000px;
    }
  }

  p {
    font-size: 16px;
    font-weight: 500;
    max-width: 500px;
  }
`;

return (
  <div className="position-relative h-100 w-100 p-1">
    <BG />
    <Card>
      <h1>NUI</h1>
      <p>
        NUI is a growing collection of beautifully designed BOS widgets - your
        building blocks for creating intuitive, modern, and beautiful BOS apps.
      </p>
      <p>
        These widgets are organized into purpose-driven categories: Navigation,
        Input, Layout, Data, Feedback, Media, Interaction, and Typography.
      </p>
    </Card>
    <Circle1 />
    <Circle2 />
  </div>
);
