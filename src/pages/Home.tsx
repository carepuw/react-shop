import React from 'react'

import { Post } from '../util/types'

import Loading from '../components/Loading'
import { CardComponent } from '../components/Card';

const Home: React.FC = () => {
  const [state, setState] = React.useState({
    itemsData: [],
    isLoading: true
  });

  React.useEffect(() => {
    fetch('/posts').then(d => d.json()).then(d => setState({ ...state, itemsData: d, isLoading: false }));
    // eslint-disable-next-line
  }, [])

  return (
    <div className="items-container">
      {state.isLoading
        ? <Loading />
        : state.itemsData.map((e: Post) => CardComponent(e))
      }
    </div>
  )
}

export default Home
