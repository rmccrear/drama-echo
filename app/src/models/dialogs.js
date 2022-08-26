import { getApiFetcher } from "./api";
import mockData from "../__test__/db-seeds";

//const fetchDialogsForUser = async (user_id) => {
//  return mockData.dialogs.filter((d) => d.user_id === user_id);
//};

// const fetchDialog = async (dialog_id) => {
//   return mockData.dialogs.find((d) => d._id === dialog_id);
// };

const fetchDialogsForUser = async () => {
  const axios = getApiFetcher();
  return axios
    .get(`/dialogs`)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

const fetchDialog = (dialog_id) => {
  const axios = getApiFetcher();
  return axios
    .get(`/dialogs/${dialog_id}`)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

const fetchLinesForDialog = async (dialog_id) => {
  return mockData.lines.filter((line) => line.dialog_id === dialog_id);
};

const createDialog = (dialogParams) => {
  const axios = getApiFetcher();
  return axios
    .post("/dialogs", dialogParams)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

const updateDialog = (dialogId, dialogParams) => {
  const axios = getApiFetcher();
  return axios
    .put(`/dialogs/${dialogId}`, dialogParams)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

const blankDialog = () => {
  return {
    title: "",
    characters: ["", ""],
  };
};

export {
  fetchDialogsForUser,
  fetchDialog,
  fetchLinesForDialog,
  createDialog,
  updateDialog,
  blankDialog,
};
