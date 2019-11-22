const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("../../utils/validation");

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const userResolver = {
  Mutation: {
    register: async (_, { registerInput }) => {
      try {
        await registerSchema.validate(registerInput);
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
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      const user = await newUser.save();

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    login: async (_, { loginInput }) => {
      try {
        await loginSchema.validate(loginInput);
      } catch (err) {
        throw new Error(err.errors[0]);
      }

      const { username, password } = loginInput;

      const user = await User.findOne({ username });
      if (!user) throw new Error("User does not exist!");

      const match = bcrypt.compare(password, user.password);

      if (!match) throw new Error("Password is incorrect!");

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
};

module.exports = userResolver;
