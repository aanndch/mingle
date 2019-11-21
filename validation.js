const yup = require("yup");

const userSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .trim()
    .max(255),
  email: yup
    .string()
    .min(3)
    .max(255)
    .trim()
    .email(),
  password: yup
    .string()
    .min(3)
    .max(255),
  confirmPassword: yup
    .string()
    .min(3)
    .max(255)
});

module.exports = { userSchema };
