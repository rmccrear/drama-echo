module.exports = {
  users: [{ sub: "1" }, { sub: "2" }, { sub: "3" }],
  dialogs: [
    {
      title: "First Dialog",
      characters: ["Romeo", "Juliet"],
      user_sub: "1",
      lines: [],
    },
    {
      title: "Second Dialog",
      characters: ["Rose", "Jack"],
      user_sub: "1",
      lines: [],
      _id: "630a32ef36cc7ba320a3a637",
    },
    {
      title: "Third Dialog",
      characters: ["Hamlet"],
      user_sub: "2 ",
      lines: [],
    },
  ],
  lines: [
    [
      {
        content: "I'll no longer be a Capulet.",
        characterIdx: 1,
        audio: {
          url: "https://cloudinary.com/1234J",
          audio_id: "1234J",
        },
      },
      {
        content: "Shall I speak?",
        characterIdx: 0,
        audio: {
          url: "https://cloudinary.com/1234R",
          audio_id: "1234R",
        },
      },
    ],
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
          audio_id: "12345",
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
  practices: [
    {
      user_sub: "1",
      dialog_id: "630a32ef36cc7ba320a3a637", // Second Dialog
      characterIdx: 0,
      echoes: [],
    },
    {
      user_sub: "2",
      dialog_id: "630a32ef36cc7ba320a3a637", // Second Dialog
      characterIdx: 1,
      echoes: [],
    },
  ],
};
