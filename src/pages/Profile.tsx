import React from 'react'
import moment from 'moment';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import { CardComponent } from '../components/Card';

import { api } from '../util/api';
import { Post, ProfileData, SystemState } from '../util/types';

import { Image, Card, Button } from 'react-bootstrap';

import '../Profile.css';

const Profile: React.FC = () => {
  interface state {
    data: ProfileData,
    allPosts: [Post] | [],
    isLoading: boolean,
    downloadFile: any
  }

  const userData = useSelector((data: SystemState) => data);
  const [state, setState] = React.useState<state>({
    data: null,
    allPosts: [],
    isLoading: true,
    downloadFile: null
  });

  React.useEffect(() => {
    api('/profile', 'POST', userData.user).then(({ data, allPosts }) => setState({ ...state, data, allPosts, isLoading: false }))
  }, [])

  const handleDownload = (url: string): void => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        let objectURL = URL.createObjectURL(blob);
        setState({ ...state, downloadFile: objectURL })
        const a: HTMLElement = document.getElementById('download')!;
        a.click();
      });
  }

  return !state.isLoading ? (
    <div className="container">
      <div className="profile-container dFlex">
        <div className="profile-image-wrapper">
          <Image src={state.data?.src} fluid />
        </div>
        <div>
          <h3>{userData.user?.name}</h3>
          <ul>
            <li>Balance: <b>{userData.user?.money.toFixed(2)}$</b></li>
            <li>You purshase: <b>{state.data?.userPurshased.length}</b></li>
            <li>Purshased your images: <b>{state.data?.purshasedUserPosts.length}</b></li>
            <li>Creation Date: {moment(userData.user?.createdAt).format('DD.MM.YYYY HH:MM')}</li>
          </ul>
        </div>
      </div>

      <div className="profile-container">
        {state.data?.userPurshased.length === 0 ?
          <div className="profile-title">No one purshased image...</div>
          : <>
            <div className="profile-title mb05">Purshased images:</div>
            <div className="profile-card-container">
              {
                state.data?.userPurshased.map(e =>
                  <Card key={e.id} style={{ justifySelf: 'stretch' }}>
                    <Card.Img style={{ height: '10rem' }} variant="top" src={e.src} />
                    <Card.Body>
                      <Card.Title className="word-break">{e.text}</Card.Title>
                      <Button disabled={e.id === 1242143} onClick={() => handleDownload(e.src)} variant="primary" block>Download</Button>
                      <a id="download" style={{ display: 'none' }} href={state.downloadFile} download></a>
                    </Card.Body>
                  </Card>
                )
              }
            </div></>
        }
      </div>

      <div className="profile-container">
        {state.allPosts?.length === 0 ?
          <div className="profile-title">No one image on sale...</div>
          : <>
            <div className="profile-title mb05">Your images on sale:</div>
            <div className="profile-card-container">
              {
                state.allPosts!.map((e: Post) => CardComponent(e))
              }
            </div></>
        }
      </div>

    </div>
  ) : <Loading />
}

export default Profile
