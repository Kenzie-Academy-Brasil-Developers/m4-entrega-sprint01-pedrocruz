import users from "../database";

const isAdminMiddleware = (request, response, next) => {
  const findAdm = users.find((element) => element.uuid === request.id);
  if (findAdm.isAdm) {
    return next();
  } else if (findAdm.uuid === request.params.id && request.method === "PATCH") {
    return next();
  }

  return response.status(403).json({ message: "missing admin permissions" });
};
export default isAdminMiddleware;
