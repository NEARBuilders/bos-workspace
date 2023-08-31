const BG = styled.div`
  background-color: #4cc38a;
  background-image: linear-gradient(180deg, #c5ecdb 0%, #a5e1c6 100%);
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
  background: linear-gradient(90deg, #a5e1c6 0%, #c5ecdb 100%), #4cc38a;
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
  background: linear-gradient(90deg, #a5e1c6 0%, #c5ecdb 100%);
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
      #1a1a1a 0%,
      #4e8b67 25%,
      #4cc38a 50%,
      #4e8b67 75%,
      #1a1a1a 100%
    );
    padding-right: 100px;
    color: #000;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 50s ease infinite;

    svg {
      width: 1em;
      height: auto;
    }
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
      <h1>
        <svg
          width="640"
          height="640"
          viewBox="0 0 640 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="320" cy="320" r="320" fill="#141716" />
          <rect
            x="444.69"
            y="355.605"
            width="60"
            height="60"
            transform="rotate(-90 444.69 355.605)"
            fill="white"
          />
          <rect
            x="314.692"
            y="285.605"
            width="60"
            height="60"
            transform="rotate(-90 314.692 285.605)"
            fill="white"
          />
          <rect
            x="314.692"
            y="425.605"
            width="60"
            height="60"
            transform="rotate(-90 314.692 425.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="495.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 495.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="355.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 355.605)"
            fill="white"
          />
          <rect
            x="184.69"
            y="215.605"
            width="60"
            height="60"
            transform="rotate(-90 184.69 215.605)"
            fill="white"
          />
        </svg>
        Livepeer UI
      </h1>
      <p>
        Livepeer is pioneering a scalable, decentralized video infrastructure
        network that empowers developers and broadcasters to create powerful
        video applications.
      </p>
      <p>
        This a collection of widgets that can be used to build Livepeer apps on
        the Blockchain Operating System.
      </p>
    </Card>
    <Circle1 />
    <Circle2 />
  </div>
);
