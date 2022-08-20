import mockData from "../__test__/db-seeds";

const USER_ID = 1;

const fetchUser = () => {
  return mockData.users.find((u) => u._id === USER_ID);
};

export { fetchUser };
