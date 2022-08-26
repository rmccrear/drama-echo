import { fetchUser } from "../user";

const sampleDb = require("../../__test__/db-seeds");

const USER_ID = "1";

const wrapAxiosCall = (data) => {
  return Promise.resolve({ data: data });
};

const setupEchoDialogAuth = jest.fn();
const getApiFetcher = () => {
  return {
    get: (url) => {
      if (url === "/dialogs") {
        return wrapAxiosCall(
          sampleDb.dialogs.filter((d) => d.user_id === USER_ID)
        );
      } else if (url.match(/^\/dialogs\/\w+/)) {
        const dialog_id = url.match(/^\/dialogs\/(\w+)/)[1];
        return wrapAxiosCall(sampleDb.dialogs.find((d) => d._id === dialog_id));
      }
    },
    post: (url, data) => {
      if (url === "/dialogs/new") {
        return wrapAxiosCall({ ...data, _id: "123created123" });
      }
    },
    update: (url, data) => {
      if (url.match(/^\/dialogs\/\w+/)) {
        const dialog_id = url.match(/^\/dialogs\/(\w+)/)[1];
        const dialog = sampleDb.dialogs.find((d) => d._id === dialog_id);
        return wrapAxiosCall({ ...dialog, ...data });
      }
    },
  };
};

export { setupEchoDialogAuth, getApiFetcher };
