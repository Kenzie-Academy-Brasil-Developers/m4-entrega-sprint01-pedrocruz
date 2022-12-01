import { hash } from "bcryptjs";
import users from "../database";

const editUserService = async (userId, body) => {
  const id = users.findIndex((element) => element.uuid == userId);

  if (body.password) {
    const newPassword = await hash(body.password, 12);
    users[id].password = newPassword;
  }

  Object.keys(users[id]).forEach((key) => {
    Object.keys(body).forEach((bodyKey) => {
      if (
        key == bodyKey &&
        key != "isAdm" &&
        key != "createdOn" &&
        key != "password"
      ) {
        users[id][key] = body[bodyKey];
      }
    });
  });

  users[id].updatedOn = new Date();

  return [200, users[id]];
};
export default editUserService;
