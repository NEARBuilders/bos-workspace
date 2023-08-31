const path = props.path;
const blockHeight = props.blockHeight;

const VideoCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const VideoTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1.2em;
`;

const VideoDescription = styled.p`
  font-size: 0.9em;
  color: #666;
`;

const VideoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  color: #888;
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 12px;
`;

function handleExpandVideo() {
  if (props.handleExpandVideo) {
    props.handleExpandVideo(path, blockHeight);
  }
}

const videoThing = Social.getr(path, blockHeight);

if (!videoThing) return <p>Loading...</p>;

const data = JSON.parse(videoThing[""] || "null");
const RouterLink = props.RouterLink;

return (
  <VideoCard>
    <RouterLink to={"view"} passProps={{ path, blockHeight }}>
      <VideoThumbnail
        src={data.poster || "https://placehold.co/450x300/000000/000000/png"}
        alt={videoThing.metadata.name}
      />
    </RouterLink>
    <VideoTitle>{videoThing.metadata.name}</VideoTitle>
    <VideoDescription>{videoThing.metadata.description}</VideoDescription>
    <VideoInfo>
      <span>
        Duration:{" "}
        {data?.videoSpec?.duration ? `${data?.videoSpec.duration}s` : "N/A"}
      </span>
      <span>Format: {data?.videoSpec?.format || "N/A"}</span>
    </VideoInfo>
    <a href={data?.downloadUrl} target="_blank" rel="noopener noreferrer">
      Download Video
    </a>
  </VideoCard>
);
