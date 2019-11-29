import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Image,
  Card,
  Icon,
  Button,
  Label,
  Form
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

import { AuthContext } from "../context/auth";

const SinglePost = props => {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const commentInputRef = useRef(null);
  const [comment, setComment] = useState("");

  const { data } = useQuery(FETCH_POST, {
    variables: {
      postId
    }
  });

  const [submitCommment] = useMutation(SUBMIT_COMMENT, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: { postId, body: comment }
  });

  const redirect = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      getPost: { id, body, createdAt, comments, likes, username }
    } = data;

    postMarkup = (
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} id={id} likes={likes} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("Comment")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {comments.length}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={redirect} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <Button
                        type="submit"
                        disabled={comment.trim() === ""}
                        onClick={submitCommment}
                        color="teal"
                      >
                        Comment
                      </Button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return <div>{postMarkup}</div>;
};

const SUBMIT_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

const FETCH_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
