import express from "express";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "./database";

const app = express();
app.use(express.json());
const PORT = 3000;

const createUserServices = async (userData) => {
  const newUser = {
    uuid: uuidv4(),
    ...userData,
    password: await hash(userData.password, 12),
  };
  users.push(newUser);
  return [201, newUser];
};
const createUserController = async (request, response) => {
  const [status, data] = await createUserServices(request.body);
  return response.status(status).json(data);
};

app.post("/users", createUserController);

app.listen(PORT, () => {
  console.log(`Run on PORT ${PORT}`);
});
export default app;
