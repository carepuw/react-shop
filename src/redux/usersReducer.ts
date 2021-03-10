import jwtDecode from 'jwt-decode';
import { SystemState } from '../util/types';

const initialState: SystemState = {
  loggedIn: false,
  user: null
}

if (localStorage.getItem('JwtToken')) {
  initialState.user = jwtDecode(localStorage.getItem('JwtToken') || '{}');
  initialState.loggedIn = true;
}

export function usersReducer(state = initialState, action: any): SystemState {
  switch (action.type) {
    case 'LOGOUT': {
      return { loggedIn: false, user: action.payload }
    }
    case 'LOGIN': {
      return { loggedIn: true, user: action.payload }
    }
    default: return state;
  }
}
