import { compare } from "bcryptjs";
import users from "../database";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userLoginService = async (email, password) => {
  const user = users.find((el) => el.email === email);

  if (!user) {
    return [401, { message: "email or password not found" }];
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return [401, { message: "email or passaword not found" }];
  }

  const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
    subject: user.uuid,
  });

  return [200, { token }];
};
export default userLoginService;
