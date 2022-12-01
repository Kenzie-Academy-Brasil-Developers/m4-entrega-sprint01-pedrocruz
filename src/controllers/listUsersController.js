import listUsersServices from "../services/listUsersServices";

const listUsersController = (request, response) => {
  const [status, data] = listUsersServices();

  return response.status(status).json(data);
};
export default listUsersController;
