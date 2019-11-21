const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { userSchema } = require("../../validation");

const userResolver = {
  Mutation: {
    register: async (_, { registerInput }) => {
      try {
        await userSchema.validate(registerInput);
      } catch (err) {
        throw new Error(err.errors[0]);
      }

      const { username, password, confirmPassword, email } = registerInput;

      const usernameExists = await User.findOne({ username }).exec();
      if (usernameExists) throw new Error("Username exists!");

      const emailExists = await User.findOne({ email }).exec();
      if (emailExists)
        throw new Error("An account with that email address already exists!");

      if (password !== confirmPassword)
        throw new Error("Passwords do not match!");

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        hashedPassword,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res._id,
          email: res.email,
          username: res.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};

module.exports = userResolver;
