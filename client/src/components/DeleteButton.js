import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm } from "semantic-ui-react";

const DeleteButton = ({ postId }) => {
  const [open, setOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST, {
    update(proxy, result) {
      setOpen(false);
      // TODO remove post from cache
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
