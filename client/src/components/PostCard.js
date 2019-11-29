import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";

const PostCard = ({
  post: { body, createdAt, id, username, likes, comments }
}) => {
  const likePost = () => {
    console.log("Liked!");
  };

  const commentOnPost = () => {
    console.log("Commented!");
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>
          Molly wants to add you to the group <strong>musicians</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="red" basic>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {likes.length}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentOnPost}>
          <Button color="teal" basic>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="teal" pointing="left">
            {likes.length}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
