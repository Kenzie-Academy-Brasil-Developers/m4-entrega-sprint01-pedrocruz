import createUserServices from "../services/createUserService";

const createUserController = async (request, response) => {
  const [status, data] = await createUserServices(request.body);
  return response.status(status).json(data);
};
export default createUserController;
