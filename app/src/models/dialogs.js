import { getApiFetcher } from "./api";
// import mockData from "../__test__/db-seeds";
// import axios from "axios";

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

const blankLine = () => {
  return new Line({ content: "", characterIdx: 0 });
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
    this.status = d.status;
    this.demoMedia = d.demoMedia;
  }
}

class Line {
  constructor(l) {
    this.content = l.content;
    this.characterIdx = l.characterIdx;
    this._id = l._id;
    this.user_sub = l.user_sub;
    this.audioUrl = l.audioUrl;
  }
}

function createLineOfDialog(dialog, lineParams) {
  const axios = getApiFetcher();
  return axios
    .post(`/dialogs/${dialog._id}/lines/new`, lineParams)
    .then((resp) => {
      return new Line(resp.data);
    })
    .catch((e) => {
      console.log(e);
    });
}
function updateLineOfDialog(dialog, lineParams) {
  const axios = getApiFetcher();
  const dialog_id = dialog._id;
  const line_id = lineParams._id;
  return axios
    .put(`/dialogs/${dialog_id}/lines/${line_id}`, lineParams)
    .then((resp) => {
      return new Line(resp.data);
    })
    .catch((e) => {
      console.log(e);
      return { error: e };
    });
}

function deleteLineOfDialog(dialog, line) {
  const axios = getApiFetcher();
  const dialog_id = dialog._id;
  const line_id = line._id;
  return axios
    .delete(`/dialogs/${dialog_id}/lines/${line_id}`)
    .then((resp) => {
      return new Dialog(resp.data);
    })
    .catch((e) => {
      console.log(e);
      return { error: e };
    });
}

export {
  fetchDialogsForUser,
  fetchDialog,
  createDialog,
  updateDialog,
  blankDialog,
  deleteDialog,
  Dialog,
  Line,
  createLineOfDialog,
  updateLineOfDialog,
  deleteLineOfDialog,
  blankLine,
};
