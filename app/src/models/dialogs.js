import mockData from "../__test__/db-seeds";

const fetchDialogsForUser = async (user_id) => {
  return mockData.dialogs.filter((d) => d.user_id === user_id);
};

const fetchLinesForDialog = async (dialog_id) => {
  return mockData.lines.filter((line) => line.dialog_id === dialog_id);
};

export { fetchDialogsForUser, fetchLinesForDialog };
