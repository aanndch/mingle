const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentsResolvers = require("./comments");

const resolvers = {
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation
  }
};

module.exports = resolvers;
