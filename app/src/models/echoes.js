import { getApiFetcher } from "./api";
import { Dialog } from "./dialogs";

async function getDialogFeed(excludedDialogs) {
  const axios = getApiFetcher();
  return axios
    .get(`/dialog-feed`)
    .then((resp) => {
      if (resp.data.length) {
        return resp.data.map((dialog) => new Dialog(dialog));
      } else return [];
    })
    .catch((e) => {
      console.log(e);
    });
}

async function getPracticeFromDialogId(dialog_id) {
  const axios = getApiFetcher();
  return axios
    .post(`/practice/${dialog_id}`, {}) // This does a "get or create"
    .then((resp) => {
      return resp.data;
    });
}

async function setCharacterIdxForPractice(characterIdx, practice_id) {
  const axios = getApiFetcher();
  return axios
    .put(`/practice/${practice_id}`, { characterIdx })
    .then((resp) => {
      return resp.data;
    });
}

async function updateEcho(practice_id, echo) {
  const axios = getApiFetcher();
  return axios
    .put(`/practice/${practice_id}/${echo._id}`, echo)
    .then((resp) => {
      return resp.data;
    });
}

const genLinkToEcho = (dialog_id) => {
  const { protocol, host } = window.location;
  return `${protocol}//${host}/echo/${dialog_id}`;
};

export {
  getDialogFeed,
  getPracticeFromDialogId,
  setCharacterIdxForPractice,
  updateEcho,
  genLinkToEcho,
};
