const yup = require("yup");

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .max(255),
  email: yup
    .string()
    .min(3)
    .max(255)
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

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .trim()
    .max(255),
  password: yup
    .string()
    .min(3)
    .max(255)
});

module.exports = { registerSchema, loginSchema };
