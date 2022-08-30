import React, { useState } from "react";

let recordedChunks = [];
function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
  }
}

let stream;
let mediaRecorder = null;
async function initUserMedia() {
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }
}

function withMediaRecorder(Component) {
  return (props) => {
    const [mediaRecorderState, setMediaRecorderState] = useState(false);
    async function startRecording() {
      await initUserMedia();
      recordedChunks = [];
      if (mediaRecorder.state !== "recording") mediaRecorder.start();
      setMediaRecorderState(mediaRecorder.state);
    }
    function stopRecording() {
      return new Promise((resolve, reject) => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.onstop = (e) => {
            resolve([
              new Blob(recordedChunks, { type: mediaRecorder.mimeType }),
              mediaRecorder.mimeType,
            ]);
          };
          mediaRecorder.stop();
          setMediaRecorderState(mediaRecorder.state);
        } else {
          reject();
        }
      });
    }

    return (
      <Component
        {...props}
        initUserMedia={initUserMedia}
        startRecording={startRecording}
        stopRecording={stopRecording}
        mediaRecorderState={mediaRecorderState}
      />
    );
  };
}

export default withMediaRecorder;
