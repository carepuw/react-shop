import React from 'react';
import { useSnackbar } from 'notistack'
import { Link } from 'react-router-dom';

import { api } from '../util/api';
import { SystemState } from '../util/types';
import { useSelector } from 'react-redux';

import { Button, Form, Image } from 'react-bootstrap';

function bytesToSize(bytes: number) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const CreateAuction: React.FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  interface typeState {
    src: string,
    size: string,
    name: string,
  }

  const userData = useSelector((data: SystemState) => data);
  const [state, setState] = React.useState<typeState>();
  const [formValue, setFormValue] = React.useState({
    label: '',
    price: ''
  })

  const clickOnOpenImage = (): void => {
    const input: HTMLElement = document.getElementById('fileInput')!;
    input.setAttribute('accept', ['.png', '.jpg'].join(','))
    input.click();
  }

  const inputAction = (e: any) => {
    const file = e.target.files[0]
    if (!e.target.files.length) { return }
    if (file.type !== 'image/jpeg') { return }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv: string = ev.target!.result! as string;
      setState({
        src: csv,
        size: file.size,
        name: file.name
      });
    }

    reader.readAsDataURL(file);
  }

  const handleLoad = () => {
    let body = {
      author: {
        name: userData.user!.name,
        id: userData.user!.id,
      },
      text: formValue.label,
      price: +formValue.price,
      img: state!.src,
    }
    api('add-post', 'POST', body).then(res => {
      if (res) {
        enqueueSnackbar('Success', {
          variant: 'success',
        })
      } else {
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        })
      }
    })
  }

  const handleChange = (e: any) => { setFormValue({ ...formValue, [e.target!.name]: e.target!.value }) }

  return (
    <div className="container">
      <div className="post-header">
        <div className="image-container">
          <Form.Control onChange={(e: any) => inputAction(e)} style={{ display: 'none' }} id="fileInput" type="file" />
          <div>
            <Button onClick={() => clickOnOpenImage()}>Load Image</Button>
          </div>
          {state &&
            <div className="mt1 image-prev-container">
              <Image className="img-prev" src={state.src} />
              <div className="div-prev">
                <span>{state.name}</span>
                <span>{bytesToSize(+state.size)}</span>
              </div>
            </div>
          }
        </div>
        <div className="post-header--text">
          <h3 className="profile-title">Post Info</h3>
          <Form.Control name="label" value={formValue.label} onChange={handleChange} type="text" placeholder="Label" />
          <Form.Control name="price" value={formValue.price} onChange={handleChange} className="mt1" type="text" placeholder="Price" />
        </div>
      </div>
      <div className="mt1" style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/">
          <Button onClick={handleLoad} className='ml1' disabled={(!state) || (formValue.label.trim().length === 0) || (formValue.price.trim().length === 0)} >Create post</Button>
        </Link>
      </div>
    </div>
  )
}

export default CreateAuction;
