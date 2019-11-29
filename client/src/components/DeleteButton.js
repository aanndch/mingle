import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

const DeleteButton = ({ postId, callback }) => {
  const [open, setOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST, {
    update(proxy) {
      setOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
        variables: { postId }
      });
      data.getPosts = data.getPosts.filter(post => post.id !== postId);
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data,
        variables: { postId }
      });
      if (callback) return callback();
    },
    variables: { postId }
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
