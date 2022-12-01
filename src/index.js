import express from "express";
import editUserController from "./controllers/editUserController";
import deleteUserController from "./controllers/deleteUserController";
import profileController from "./controllers/profileController";
import userLoginController from "./controllers/userLoginController";
import listUsersController from "./controllers/listUsersController";
import createUserController from "./controllers/createUserController";
import emailExistMiddleware from "./middlewares/emailExistMiddleware";
import authTokenMiddleware from "./middlewares/authTokenMiddleware";
import isAdminMiddleware from "./middlewares/isAdminMiddleware";
import userExistsMiddleware from "./middlewares/userExistsMiddleware";

const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/users", emailExistMiddleware, createUserController);
app.get("/users", authTokenMiddleware, isAdminMiddleware, listUsersController);
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
export default app;
