import testData from "../__test__/db-seeds";
const testUser = testData.users[0];

const isAuthenticated = true;
const setupAccessToken = () => {};

const withAuth = (Component) => {
  return (props) => {
    return (
      <Component
        {...props}
        user={testUser}
        setupAccessToken={setupAccessToken}
        isAuthenticated={isAuthenticated}
      />
    );
  };
};
export default withAuth;
