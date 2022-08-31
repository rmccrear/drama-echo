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

async function setCharacterIdxForPratice(characterIdx, practice_id) {
  const axios = getApiFetcher();
  return axios
    .put(`/practice/${practice_id}`, { characterIdx })
    .then((resp) => {
      return resp.data;
    });
}

export { getDialogFeed, getPracticeFromDialogId, setCharacterIdxForPratice };
