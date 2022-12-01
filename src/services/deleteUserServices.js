import users from "../database";

const deleteUserService = (userIndex) => {
  users.slice(userIndex, 1);

  return [204];
};
export default deleteUserService;
