const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const authentication = req => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
      } catch (err) {
        throw new Error("Invalid/Expired token!");
      }
    }
    throw new Error("Authentication token must be 'Bearer [TOKEN]'");
  }
  throw new Error("Authorization header must be provided!");
};

module.exports = authentication;
