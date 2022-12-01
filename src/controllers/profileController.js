import profileServices from "../services/profileServices";

const profileController = (request, response) => {
  const [status, user] = profileServices(request.id);

  return response.status(status).json(user);
};
export default profileController;
