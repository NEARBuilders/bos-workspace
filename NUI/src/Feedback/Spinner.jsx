const color1 = props.color1 ?? "#FFD50D";
const color2 = props.color2 ?? "#4498E0";

const Loader = styled.div`
  width: 48px;
  height: 48px;
  display: block;
  margin: 15px auto;
  position: relative;
  color: ${color1};
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  &::after,
  &::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    width: 24px;
    height: 24px;
    top: 50%;
    left: 50%;
    transform: scale(0.5) translate(0, 0);
    background-color: ${color1};
    border-radius: 50%;
    animation: animloader 1s infinite ease-in-out;
  }
  &::before {
    background-color: ${color2};
    transform: scale(0.5) translate(-48px, -48px);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes animloader {
    50% {
      transform: scale(1) translate(-50%, -50%);
    }
  }
`;

return <Loader></Loader>;
