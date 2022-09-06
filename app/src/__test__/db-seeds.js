module.exports = {
  dialogs: [
    {
      _id: "1abc",
      title: "First Dialog",
      characters: ["Romeo", "Juliet"],
      user_id: "1",
      lines: [],
    },
    {
      _id: "2def",
      title: "Second Dialog",
      characters: ["Rose", "Jack"],
      user_id: "1",
      lines: [
        {
          content: "Promise me now.",
          character: "Jack",
          dialog_id: "2def",
          audio: {
            url: "https://cloudinary.com/1234",
            audio_id: "1234",
          },
        },
        {
          content: "I promise.",
          character: "Rose",
          dialog_id: "2def",
          audio: {
            url: "https://cloudinary.com/12345",
            audio_id: "1234",
          },
        },
        {
          content: "Never let go.",
          character: "Jack",
          dialog_id: "2def",
        },
        {
          content: "I'll never let go.",
          character: "Rose",
          dialog_id: "2def",
        },
      ],
    },
    {
      _id: "3ghi",
      title: "Thrid Dialog",
      characters: ["Hamlet"],
      user_id: "2",
      lines: [],
    },
  ],
  users: [
    {
      name: "Alice",
      _id: "1",
      email: "alice@localhost",
    },
    {
      name: "Poppy",
      _id: "2",
      email: "poppy@localhost",
    },
  ],
};
