const Post = require("../../models/Post");

const postResolvers = {
  Query: {
    getPosts: async () => {
      const posts = await Post.find();
      return posts;
    }
  }
};

module.exports = postResolvers;
