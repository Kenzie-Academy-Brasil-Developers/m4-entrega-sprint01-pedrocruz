import users from "../database";

const profileServices = (idUser) => {
  const findId = users.find((element) => element.uuid === idUser);

  delete findId.password;

  return [200, findId];
};
export default profileServices;
