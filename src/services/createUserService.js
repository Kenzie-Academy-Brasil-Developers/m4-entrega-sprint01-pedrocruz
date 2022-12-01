import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import users from "../database";

const createUserServices = async (userData) => {
  userData.password = await hash(userData.password, 12);
  const newUser = {
    uuid: uuidv4(),
    ...userData,
    createdOn: new Date(),
    updatedOn: new Date(),
  };

  const respUser = {
    ...userData,
    createdOn: new Date(),
    updatedOn: new Date(),
    uuid: newUser.uuid,
  };
  users.push(newUser);
  delete respUser.password;
  return [201, respUser];
};

export default createUserServices;
