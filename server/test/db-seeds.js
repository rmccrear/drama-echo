module.exports = {
  users: [{ sub: "1" }, { sub: "2" }],
  dialogs: [
    { title: "First Dialog", characters: ["Romeo", "Juliet"], user_sub: "1" },
    { title: "Second Dialog", characters: ["Rose", "Jack"], user_sub: "1" },
    { title: "Third Dialog", characters: ["Hamlet"], user_sub: "2 " },
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
