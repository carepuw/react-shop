import { createStore } from 'redux'
import { usersReducer } from './usersReducer';

const store = createStore(usersReducer);
export default store;