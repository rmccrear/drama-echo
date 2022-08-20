module.exports = {
  dialogs: [
    { title: "First Dialog", characters: ["Romeo", "Juliet"] },
    { title: "Second Dialog", characters: ["Rose", "Jack"] },
    { title: "Thrid Dialog", characters: ["Hamlet"] },
  ],
  lines: [
    [],
    [
      {
        content: "Promise me now.",
        character: "Jack",
        audio: {
          url: "https://cloudinary.com/1234",
          audio_id: "1234",
        },
      },
      {
        content: "I promise.",
        character: "Rose",
        audio: {
          url: "https://cloudinary.com/12345",
          audio_id: "1234",
        },
      },
      {
        content: "Never let go.",
        character: "Jack",
      },
      {
        content: "I'll never let go.",
        character: "Rose",
      },
    ],
    [],
  ],
};
