import { fetchUser } from "../user";

const sampleDb = require("../../__test__/db-seeds");

const USER_ID = "1";

const wrapAxiosCall = (data) => {
  return Promise.resolve({ data: data });
};

let getCalled, postCalled, putCalled, deleteCalled;

getCalled = jest.fn();
postCalled = jest.fn();
putCalled = jest.fn();
deleteCalled = jest.fn();

const setupEchoDialogAuth = jest.fn();
const getApiFetcher = () => {
  return {
    get: (url) => {
      getCalled(url);
      if (url === "/dialogs") {
        return wrapAxiosCall(
          sampleDb.dialogs.filter((d) => d.user_id === USER_ID)
        );
      } else if (url.match(/^\/dialogs\/\w+/)) {
        const dialog_id = url.match(/^\/dialogs\/(\w+)/)[1];
        return wrapAxiosCall(sampleDb.dialogs.find((d) => d._id === dialog_id));
      } else if (url.match(/^\/dialog-feed/)) {
        return wrapAxiosCall(sampleDb.dialogs);
      }
    },
    post: (url, data) => {
      postCalled(url, data);
      if (url === "/dialogs") {
        return wrapAxiosCall({ ...data, _id: "123created123" });
      }
    },
    put: (url, data) => {
      putCalled(url, data);
      if (url.match(/^\/dialogs\/\w+/)) {
        const dialog_id = url.match(/^\/dialogs\/(\w+)/)[1];
        const dialog = sampleDb.dialogs.find((d) => d._id === dialog_id);
        return wrapAxiosCall({ ...dialog, ...data });
      }
    },
    delete: (url) => {
      deleteCalled(url);
      if (url.match(/^\/dialogs\/\w+/)) {
        const dialog_id = url.match(/^\/dialogs\/(\w+)/)[1];
        return wrapAxiosCall({ message: "Deleted Document " + dialog_id });
      }
    },
  };
};

const resetMockCalls = () => {
  getCalled = jest.fn();
  postCalled = jest.fn();
  putCalled = jest.fn();
  deleteCalled = jest.fn();
};

const wakeUpServer = jest.fn();

export {
  setupEchoDialogAuth,
  getApiFetcher,
  getCalled,
  postCalled,
  putCalled,
  deleteCalled,
  resetMockCalls,
  wakeUpServer,
};
