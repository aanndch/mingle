const postResolvers = require("./posts");
const userResolvers = require("./users");

const resolvers = {
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation
  }
};

module.exports = resolvers;
