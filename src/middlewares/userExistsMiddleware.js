import users from "../database";

const userExistsMiddleware = (request, response, next) => {
  const userId = request.params.id;
  const userExist = users.findIndex((user) => user.uuid === userId);

  if (userExist === -1) {
    return response.status(404).json({ message: "user not found" });
  }

  request.user = userExist;

  return next();
};
export default userExistsMiddleware;
