const deleteMedia = jest.fn().mockImplementation(() => {
  return Promise.resolve({ result: "ok" });
});

const sign = () => {
  return Promise.resolve();
};

module.exports = { sign, deleteMedia };
