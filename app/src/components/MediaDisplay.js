const MediaDisplay = (props) => {
  const { demoMedia } = props;
  let sources = <source src={demoMedia?.url} />;
  if (demoMedia && demoMedia.url) {
    const match = demoMedia.url.match(/(.+)\.(\w+)$/);
    const url1 = match[1];
    // const ext = match[2];
    if (demoMedia.mediaType === "video") {
      sources = (
        <>
          <source src={demoMedia.url} />
          <source src={`${url1}.mp4`} />
          <source src={`${url1}.webm`} />
        </>
      );
    } else if (demoMedia.mediaType === "audio") {
      sources = (
        <>
          <source src={demoMedia.url} />
          <source src={`${url1}.mp3`} />
          <source src={`${url1}.aac`} />
          <source src={`${url1}.webm`} />
        </>
      );
    }
  }
  if (demoMedia && demoMedia.mediaType === "video" && demoMedia.url) {
    return (
      <video controls={true} className="media-demo-video">
        {sources}
      </video>
    );
  } else if (demoMedia && demoMedia.mediaType === "audio" && demoMedia.url) {
    return (
      <audio controls={true} className="media-demo-audio">
        {sources}
      </audio>
    );
  } else {
    return "";
  }
};

export default MediaDisplay;
