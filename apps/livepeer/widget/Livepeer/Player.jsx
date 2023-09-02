/**
 * Livepeer Player
 *
 * Widget for playing a video from Livepeer
 * (https://docs.livepeer.org/reference/livepeer-js/player/usePlayer)
 * 
 * Props:
 * @prop {String} title - the title of the video
 * @prop {String} playbackId - the playbackId of the video
 * @prop {Image} PosterImage - The image object for the poster image.
 * @prop {Boolean} showPipButton - whether to show the picture-in-picture button
 * @prop {String} objectFit - the object fit for the video
 * @prop {Boolean} priority - whether to prioritize the video
 */

return (
  <LivepeerPlayer
    title={props.title}
    playbackId={props.playbackId}
    poster={props.PosterImage || <></>}
    showPipButton={props.showPipButton && true}
    objectFit={props.objectFit || "cover"}
    priority={props.priority && true}
    {...props}
  />
);
