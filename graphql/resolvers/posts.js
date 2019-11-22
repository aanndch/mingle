const { AuthenticationError } = require("apollo-server-express");

const Post = require("../../models/Post");
const authentication = require("../../utils/authentication");

const postResolvers = {
  Query: {
    getPosts: async () => {
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    },
    getPost: async (_, { postId }) => {
      const post = await Post.findById({ postId });
      if (!post) throw new Error("Post not found!");

      return post;
    }
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = authentication(context.req);

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
        user: user.id
      });

      const post = await newPost.save();
      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const user = await authentication(context.req);

      const post = await Post.findById(postId);
      if (user.username !== post.username)
        throw new AuthenticationError("Unauthorized!");

      await post.delete();
      return "Post deleted successfully!";
    }
  }
};

module.exports = postResolvers;
