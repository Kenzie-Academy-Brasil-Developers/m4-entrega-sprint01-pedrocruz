import express from "express";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "./database";
import "dotenv/config";

const app = express();
app.use(express.json());
const PORT = 3000;

const isAdminMiddleware = (request, response, next) => {
  const findAdm = users.find((element) => element.uuid === request.id);
  if (findAdm.isAdm) {
    return next();
  } else if (findAdm.uuid === request.params.id && request.method === "PATCH") {
    return next();
  }

  return response.status(403).json({ message: "missing admin permissions" });
};
const userExistsMiddleware = (request, response, next) => {
  const userId = request.params.id;
  const userExist = users.findIndex((user) => user.uuid === userId);

  if (userExist === -1) {
    return response.status(404).json({ message: "user not found" });
  }

  request.user = userExist;

  return next();
};

const authTokenMiddleware = (request, response, next) => {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ message: "Missing authorization" });
  }

  const token = authToken.split(" ")[1];

  if (token === undefined) {
    return response
      .status(401)
      .json({ message: "Missing authorization token" });
  }

  return jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return response.status(401).json({ message: "Invalid token" });
    }
    request.id = decoded.sub;

    return next();
  });
};

const emailExistMiddleware = (request, response, next) => {
  const indexUser = users.find(
    (element) => element.email === request.body.email
  );

  if (indexUser) {
    return response.status(404).json({
      message: "User not found",
    });
  }
  request.user = {
    indexUser: indexUser,
  };

  return next();
};

const createUserServices = async ({ name, email, password, isAdm }) => {
  const newUser = {
    uuid: uuidv4(),
    name,
    email,
    isAdm,
    createdOn: new Date(),
    updatedOn: new Date(),
    password: await hash(password, 12),
  };

  const respUser = {
    name,
    email,
    isAdm,
    createdOn: new Date(),
    updatedOn: new Date(),
    uuid: newUser.uuid,
  };
  users.push(newUser);
  return [201, respUser];
};
const createUserController = async (request, response) => {
  const [status, data] = await createUserServices(request.body);
  return response.status(status).json(data);
};

const listUserServices = () => {
  return [200, users];
};

const listUserController = (request, response) => {
  const [status, data] = listUserServices();

  return response.status(status).json(data);
};

const userLoginController = async (request, response) => {
  const { email, password } = request.body;

  const [status, token] = await userLoginService(email, password);

  return response.status(status).json(token);
};

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

const profileController = (request, response) => {
  const [status, user] = profileServices(request.id);

  return response.status(status).json(user);
};
const profileServices = (idUser) => {
  const findId = users.find((element) => element.uuid === idUser);

  delete findId.password;

  return [200, findId];
};

const editUserController = async (request, response) => {
  const [status, data] = await editUserService(request.id, request.body);

  delete data.password;
  return response.status(status).json(data);
};
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
const deleteUserController = (request, response) => {
  console.log(request.user);
  const [status] = deleteUserService(request.user);

  return response.status(status).send();
};

const deleteUserService = (userIndex) => {
  users.slice(userIndex, 1);

  return [204];
};

app.post("/users", emailExistMiddleware, createUserController);
app.get("/users", authTokenMiddleware, isAdminMiddleware, listUserController);
app.post("/login", userLoginController);
app.get("/users/profile", authTokenMiddleware, profileController);
app.patch(
  "/users/:id",
  authTokenMiddleware,
  isAdminMiddleware,
  editUserController,
  userExistsMiddleware
);
app.delete(
  "/users/:id",
  authTokenMiddleware,
  isAdminMiddleware,
  deleteUserController
);
app.listen(PORT, () => {
  console.log(`Run on PORT ${PORT}`);
});
