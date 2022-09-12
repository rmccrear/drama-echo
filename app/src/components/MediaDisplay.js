const MediaDisplay = (props) => {
  const { demoMedia } = props;
  let sources = <source src={demoMedia?.url} />;
  let poster = "";
  if (demoMedia && demoMedia.url) {
    if (demoMedia.mediaType === "video") {
      const match = demoMedia.url.match(/(.+)\.(\w+)$/);
      const url1 = match[1];
      // const ext = match[2];
      poster = `${url1}.jpeg`;
      sources = (
        <>
          <source src={demoMedia.url} />
          <source src={`${url1}.mp4`} />
          <source src={`${url1}.webm`} />
        </>
      );
    } else if (demoMedia.mediaType === "audio") {
      const match = demoMedia.url.match(/(.+)\.(\w+)$/);
      const url1 = match[1];
      // const ext = match[2];
      sources = (
        <>
          <source src={demoMedia.url} />
          <source src={`${url1}.mp3`} />
          <source src={`${url1}.aac`} />
          <source src={`${url1}.webm`} />
        </>
      );
    } else if (
      demoMedia.mediaType === "youtube" &&
      demoMedia.url.match(
        /^https:\/\/www\.youtube\.com\/embed\/\w+\?start=[0-9]+$/
      )
    ) {
      return (
        <iframe
          width="100%"
          src={demoMedia.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  }
  if (demoMedia && demoMedia.mediaType === "video" && demoMedia.url) {
    return (
      <video controls={true} className="media-demo-video" poster={poster}>
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
