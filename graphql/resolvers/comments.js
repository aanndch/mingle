const Post = require("../../models/Post");
const authentication = require("../../utils/authentication");
const {
  UserInputError,
  AuthenticationError
} = require("apollo-server-express");

const commentsResolvers = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = authentication(context.req);

      if (body.trim() === "") {
        throw new UserInputError("Comment body cannot be empty!");
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString()
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found!");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = authentication(context.req);

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post does not exist!");

      const commentIndex = post.comments.findIndex(
        comment => comment.id === commentId
      );

      if (commentIndex === -1) throw new Error("Comment does not exist!");

      if (user.username !== post.comments[commentIndex].username)
        throw new AuthenticationError("Unauthorized action!");

      post.comments.splice(commentIndex, 1);

      await post.save();
      return post;
    },
    likePost: async (_, { postId }, context) => {
      const user = authentication(context.req);

      const post = await Post.findById(postId);
      if (!post) throw new UserInputError("Post does not exist!");

      if (post.likes.find(like => like.username === user.username)) {
        // Already liked post, unlike it
        post.likes = post.likes.filter(like => like.username !== user.username);
      } else {
        // Hasn't liked post, like it
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString()
        });
      }

      await post.save();
      return post;
    }
  }
};

module.exports = commentsResolvers;
