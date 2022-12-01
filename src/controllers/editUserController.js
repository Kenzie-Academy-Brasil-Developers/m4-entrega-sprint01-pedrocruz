import editUserService from "../services/editUserServiced";

const editUserController = async (request, response) => {
  const [status, data] = await editUserService(request.id, request.body);

  delete data.password;
  return response.status(status).json(data);
};
export default editUserController;
