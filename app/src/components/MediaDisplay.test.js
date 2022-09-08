import TestRenderer from "react-test-renderer";
import MediaDisplay from "./MediaDisplay";

test("renders MediaDisplay with video", async () => {
  const demoVideoMedia = {
    mediaType: "video",
    url: "https://example.com/1234/abcd.mov",
    format: "mov",
  };
  const demoAudioMedia = {
    mediaType: "audio",
    url: "https://example.com/1234/abcd.aac",
    format: "aac",
  };
  const tree = TestRenderer.create(
    <MediaDisplay demoMedia={demoVideoMedia} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test("renders MediaDisplay with audio", async () => {
  const demoAudioMedia = {
    mediaType: "audio",
    url: "https://example.com/1234/abcd.aac",
    format: "aac",
  };
  const tree = TestRenderer.create(
    <MediaDisplay demoMedia={demoAudioMedia} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
