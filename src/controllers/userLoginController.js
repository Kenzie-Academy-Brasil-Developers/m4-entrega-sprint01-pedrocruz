import userLoginService from "../services/userLoginService";

const userLoginController = async (request, response) => {
  const { email, password } = request.body;

  const [status, token] = await userLoginService(email, password);

  return response.status(status).json(token);
};
export default userLoginController;
