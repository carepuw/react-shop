import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '../util/types';

export const CardComponent = (e: Post, f?: () => void) =>
  <Card key={e.id} style={{ justifySelf: 'stretch' }}>
    <Card.Img style={{ height: '10rem' }} variant="top" src={e.img} />
    <Card.Body>
      <Card.Title className="word-break">{e.text}</Card.Title>
      <Button onClick={f} as={Link} to={`/post/${e.id}`} variant="primary" block>Show page</Button>
    </Card.Body>
  </Card>
