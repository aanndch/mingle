import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

const PostForm = () => {
  const [body, setBody] = useState("");

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: { body },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
        variables: { body }
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data,
        variables: { body }
      });
      setBody("");
    },
    onError(err) {
      console.log(err);
    }
  });

  const onChange = e => {
    setBody(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();

    createPost();
  };

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeword="Hi World.."
          name="body"
          onChange={onChange}
          value={body}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
