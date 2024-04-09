/**
 * Livepeer Creator
 *
 * Widget for uploading a video to Livepeer
 * (https://docs.livepeer.org/reference/livepeer-js/asset/useCreateAsset)
 *
 * Props:
 * @prop {File} video - the video file to upload
 * @prop {Object} metadata - the metadata for the video
 * @prop {Function} handleStatus - a callback for status updates
 * @prop {Function} handleProgress - a callback for progress updates
 * @prop {Function} handleError - a callback for error updates
 * @prop {Function} handleAssets - a callback for asset updates
 * @prop {Function} Button - a component to render the button
 * @prop {Boolean} debug - whether to log debug messages
 */

function handleStatus(status) {
  if (props.debug) {
    console.log("status", status);
  }
  if (props.handleStatus) {
    props.handleStatus(status);
  }
}

function handleProgress(progress) {
  if (props.debug) {
    console.log("progress", progress);
  }
  if (props.handleProgress) {
    props.handleProgress(progress);
  }
}

function handleAssets(assets) {
  if (props.debug) {
    console.log("assets", assets);
  }
  if (props.handleAssets) {
    props.handleAssets(assets);
  }
}

function handleError(error) {
  if (props.debug) {
    console.log("error", error);
  }
  if (props.handleError) {
    props.handleError(error);
  }
}

function Button({ disabled, onClick }) {
  // TODO : Livepeer branded button
  return (
    <button disabled={disabled} onClick={onClick}>
      upload to Livepeer
    </button>
  );
}

return (
  <LivepeerCreator
    video={props.video}
    metadata={props.metadata}
    Button={props.Button || Button}
    handleStatus={handleStatus}
    handleProgress={handleProgress}
    handleError={handleError}
    handleAssets={handleAssets}
    {...props}
  />
);
