const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userResolver = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      // TODO: Validate user input

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        hashedPassword,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();
      console.log(res);

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
