module.exports = {
  dialogs: [
    {
      _id: 1,
      title: "First Dialog",
      characters: ["Romeo", "Juliet"],
      user_id: 1,
    },
    {
      _id: 2,
      title: "Second Dialog",
      characters: ["Rose", "Jack"],
      user_id: 1,
    },
    { _id: 3, title: "Thrid Dialog", characters: ["Hamlet"], user_id: 2 },
  ],
  users: [
    {
      name: "Alice",
      _id: 1,
      email: "alice@localhost",
    },
    {
      name: "Poppy",
      _id: 2,
      email: "poppy@localhost",
    },
  ],
  lines: [
    {
      content: "Promise me now.",
      character: "Jack",
      dialog_id: 2,
      audio: {
        url: "https://cloudinary.com/1234",
        audio_id: "1234",
      },
    },
    {
      content: "I promise.",
      character: "Rose",
      dialog_id: 2,
      audio: {
        url: "https://cloudinary.com/12345",
        audio_id: "1234",
      },
    },
    {
      content: "Never let go.",
      character: "Jack",
      dialog_id: 2,
    },
    {
      content: "I'll never let go.",
      character: "Rose",
      dialog_id: 2,
    },
  ],
};
