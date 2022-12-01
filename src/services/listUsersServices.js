import users from "../database";

const listUsersServices = () => {
  return [200, users];
};
export default listUsersServices;
