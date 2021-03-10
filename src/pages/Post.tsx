import React from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment'
import { useSnackbar } from 'notistack'

import { login } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/Loading';
import { CardComponent } from '../components/Card';

import { api } from '../util/api';
import { Post, SystemState } from '../util/types';

import { Button, Image, Badge, Breadcrumb, ButtonGroup, OverlayTrigger } from 'react-bootstrap';
import '../Profile.css';

const PostComponent: React.FC = () => {
  interface State {
    data: null | Post,
    allPosts: null | [Post],
    forceUpdate: boolean,
    isLoading: boolean
  }
  const dispatch = useDispatch();
  const [state, setState] = React.useState<State>({
    data: null,
    allPosts: null,
    forceUpdate: false,
    isLoading: true
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userData = useSelector((data: SystemState) => data);
  React.useEffect(() => {
    api('/post', 'POST', { id: window.location.href.split('/post/')[1] }).then(({ data, allPosts }) => setState({ ...state, data, allPosts, isLoading: false }));
  }, [state.forceUpdate])

  const handleBuy = () => {
    if (userData.user!.money < state.data?.price!) {
      return enqueueSnackbar('Not enough money', {
        variant: 'error',
      })
    }

    api('/buy-post', 'POST', { userData, data: state.data }).then(r => {
      if (r) {
        enqueueSnackbar('Success', {
          variant: 'success',
        })
        dispatch(login(r, false))
      } else {
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        })
      }
    })
  }

  return (
    <div>
      { state.isLoading && <Loading />}
      {
        !state.isLoading &&
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item as={Link} to="/" href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{state.data!.text}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="post-header">
            <div className="image-container">
              <Image src={state.data!.img} fluid />
            </div>
            <div className="post-header--text">
              <div className="ph-text space">
                <span>author: {state.data!.author.name}</span>
                <span>{moment(state.data!.creationDate).fromNow()}</span>
              </div>
              <h2>{state.data!.text}</h2>
              <div style={{ textAlign: 'right' }}>
                <ButtonGroup aria-label="Basic example">
                  <OverlayTrigger overlay={<Badge style={{ fontSize: '1.2em' }} variant="secondary">Lower price</Badge>}>
                    <Button className="post-button" variant="secondary">Price:</Button>
                  </OverlayTrigger>
                  <Button className="post-button" disabled={true} variant="secondary">{state.data!.price} $</Button>
                </ButtonGroup>
              </div>
              <Link to="/">
                <Button onClick={handleBuy} style={{ marginTop: '1em' }} disabled={!userData.loggedIn || (userData.user!.id === state.data!.author.id)} block>
                  BUY
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt1">
            <h4>Other author auctions:</h4>
            <div className="profile-card-container">
              {state.allPosts!.map(e => CardComponent(e, () => setState({ ...state, forceUpdate: !state.forceUpdate })))}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default PostComponent
