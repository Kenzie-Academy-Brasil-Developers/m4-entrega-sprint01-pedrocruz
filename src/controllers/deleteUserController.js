import deleteUserService from "../services/deleteUserServices";

const deleteUserController = (request, response) => {
  console.log(request.user);
  const [status] = deleteUserService(request.user);

  return response.status(status).send();
};
export default deleteUserController;
