import users from "../database";

const emailExistMiddleware = (request, response, next) => {
  const indexUser = users.findIndex(
    (element) => element.email === request.body.email
  );

  if (indexUser !== -1) {
    return response.status(409).json({
      message: "User not found",
    });
  }

  return next();
};
export default emailExistMiddleware;
