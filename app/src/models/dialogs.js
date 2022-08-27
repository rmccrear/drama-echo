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
      if (resp.data.length) {
        return resp.data.map((dialog) => new Dialog(dialog));
      } else return [];
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
      return new Dialog(resp.data);
    })
    .catch((e) => {
      return { error: e.response };
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
      return new Dialog(resp.data);
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
      return new Dialog(resp.data);
    })
    .catch((e) => {
      console.log(e);
    });
};

const blankDialog = () => {
  return new Dialog({
    title: "",
    characters: ["", ""],
  });
};

const deleteDialog = (dialogId) => {
  const axios = getApiFetcher();
  return axios
    .delete(`/dialogs/${dialogId}`)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

class Dialog {
  constructor(d) {
    this.title = d.title;
    this.characters = d.characters || [];
    this.lines = d.lines || [];
    this._id = d._id;
    this.user_sub = d.user_sub;
  }
  toJson() {
    return {
      title: this.title,
      characters: this.characters,
      lines: this.lines,
      _id: this._id,
      user_sub: this.user_sub,
    };
  }
}

export {
  fetchDialogsForUser,
  fetchDialog,
  fetchLinesForDialog,
  createDialog,
  updateDialog,
  blankDialog,
  deleteDialog,
  Dialog,
};
