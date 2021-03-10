import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login, logout } from '../redux/actions';
import { SystemState } from '../util/types';
import { api } from '../util/api';

import { Button, Nav, Navbar, Form, ButtonGroup, InputGroup, OverlayTrigger, Popover } from 'react-bootstrap';

function Header() {
  const dispatch = useDispatch();
  const userData = useSelector((data: SystemState) => data);

  const getPageId = () => {
    const url = window.location.href.split('/');
    switch (url[url.length - 1]) {
      case 'profile': return 1
      case 'create-auction': return 2
      default: return 0
    }
  }

  const [state, setState] = React.useState({
    currentPageId: getPageId(),
    loginButLoading: false,
    email: '',
    password: '',
    dontRemember: false
  });

  const handleLogoutClick = () => {
    dispatch(logout())
    setState({ ...state, currentPageId: 0 })
  }
  const handleLoginClick = async () => {
    if (state.email.trim().length > 0 && state.password.trim().length > 0) {
      setState({ ...state, loginButLoading: true });
      const data = await api('/user', 'POST', { email: state.email, password: state.password }).then(d => d);
      if (data.length > 0) { dispatch(login(data[0], state.dontRemember)) }
      setState({ ...state, loginButLoading: false })
    }
  }

  return (
    <div className="container">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>React Auction</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" variant="pills">
            <Nav.Item>
              <Nav.Link as={Link} to='/' onClick={() => setState({ ...state, currentPageId: 0 })} active={state.currentPageId === 0}>Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to='/profile' onClick={() => setState({ ...state, currentPageId: 1 })} active={state.currentPageId === 1} disabled={!userData.loggedIn && true}>Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to='/create-auction' onClick={() => setState({ ...state, currentPageId: 2 })} active={state.currentPageId === 2} disabled={!userData.loggedIn && true}>Create auction</Nav.Link>
            </Nav.Item>
          </Nav>
          <Form inline>
            {userData.loggedIn && <InputGroup>
              <ButtonGroup aria-label="Basic example">
                <Button disabled={true} variant="secondary">{userData.user!.name}</Button>
                <Button disabled={true} variant="secondary">{userData.user!.money.toFixed(2)}$</Button>
              </ButtonGroup>
            </InputGroup>}
            {userData.loggedIn
              ? <Button as={Link} to="/" onClick={handleLogoutClick} style={{ marginLeft: '1em' }} variant="outline-success">Logout</Button>
              : <OverlayTrigger
                trigger="click"
                placement={'bottom'}
                overlay={
                  <Popover id={`popover-positioned-bottom`}>
                    <Popover.Content>
                      <Form>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control onChange={(e) => setState({ ...state, email: e.target.value })} value={state.email} type="email" placeholder="Enter email" />
                          <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control onChange={(e) => setState({ ...state, password: e.target.value })} value={state.password} type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                          <Form.Check onChange={() => setState({ ...state, dontRemember: !state.dontRemember })} type="checkbox" label="Don't remember my credentials" />
                        </Form.Group>
                        <Button disabled={state.loginButLoading} onClick={handleLoginClick} variant="primary" block>
                          {state.loginButLoading ? 'Loading...' : 'Submit'}
                        </Button>
                      </Form>
                    </Popover.Content>
                  </Popover>
                }
              >
                <Button style={{ marginLeft: '1em' }} variant="outline-success">Login</Button>
              </OverlayTrigger>
            }
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default Header
