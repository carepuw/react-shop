import { User } from '../util/types'
import jwt from 'jsonwebtoken'

export const login = (user: User, dontRemember: boolean | undefined) => {
  if (!dontRemember) {
    const token = jwt.sign(
      user!,
      'SOMEKEYAHSAH',
      { expiresIn: '1h' }
    );
    localStorage.setItem('JwtToken', token);
  }
  return ({
    type: 'LOGIN',
    payload: user
  })
}

export const logout = () => {
  localStorage.removeItem('JwtToken');
  return ({
    type: 'LOGOUT',
    payload: {}
  })
}
