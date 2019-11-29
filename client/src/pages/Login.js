import React, { useState } from "react";
import gql from "graphql-tag";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

const Login = props => {
  const [errors, setErrors] = useState("");
  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].message);
    },
    variables: values
  });

  const onSubmit = e => {
    e.preventDefault();

    loginUser();
  };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {errors && <div className="ui error message">{errors}</div>}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
