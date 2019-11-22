const Post = require("../../models/Post");
const authentication = require("../../utils/authentication");
const { UserInputError } = require("apollo-server-express");

const commentsResolvers = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = authentication(context.req);

      if (body.trim() === "") {
        throw new UserInputError("Comment body cannot be empty!");
      }

      console.log(postId);

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
    }
  }
};

module.exports = commentsResolvers;
