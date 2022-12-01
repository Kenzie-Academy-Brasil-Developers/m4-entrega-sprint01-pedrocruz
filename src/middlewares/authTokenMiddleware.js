import jwt from "jsonwebtoken";
import "dotenv/config";

const authTokenMiddleware = (request, response, next) => {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ message: "Missing authorization" });
  }

  const token = authToken.split(" ")[1];

  if (token === undefined) {
    return response
      .status(401)
      .json({ message: "Missing authorization token" });
  }

  return jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return response.status(401).json({ message: "Invalid token" });
    }
    request.id = decoded.sub;

    return next();
  });
};
export default authTokenMiddleware;
