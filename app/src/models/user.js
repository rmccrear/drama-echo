import { getApiFetcher } from "./api";
import mockData from "../__test__/db-seeds";

const USER_ID = "1";

const fetchUser = () => {
  return mockData.users.find((u) => u._id === USER_ID);
};

const getProfile = () => {
  const axios = getApiFetcher();
  return axios
    .get("/my-profile")
    .then((resp) => {
      const { data } = resp;
      console.log(data);
      return { message: data.message };
    })
    .catch((e) => {
      console.log(e);
      return { message: "Error: " + e.message };
    });
};

export { fetchUser, getProfile };
