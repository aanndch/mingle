const postResolvers = require("./posts");
const userResolvers = require("./users");

const resolvers = {
  Query: {
    ...postResolvers.Query
  }
};

module.exports = resolvers;
