import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../utils/context/authContext';
// eslint-disable-next-line import/extensions
import { createUser, updateUser } from '../api/userData';

const initialState = {
  bio: '',
  email: '',
  name: '',
  color: '',
};
function UserForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  // const [Users, setUsers] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.userId) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.userId) {
      updateUser(formInput).then(() => router.push(`/users/${obj.userId}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createUser(payload).then(({ name }) => {
        const patchPayload = { userId: name };
        updateUser(patchPayload).then(() => {
          //   router.push('/team.js');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj.userId ? 'Update' : 'Create'} User</h2>

      {/* name INPUT */}
      <FloatingLabel controlId="floatingInput1" label="User Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a name" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* email INPUT */}
      <FloatingLabel controlId="floatingInput2" label="User Email" className="mb-3">
        <Form.Control type="email" placeholder="Enter an email url" name="email" value={formInput.email} onChange={handleChange} required />
      </FloatingLabel>

      {/* bio TEXTAREA */}
      <FloatingLabel controlId="floatingTextarea" label="Bio" className="mb-3">
        <Form.Control as="textarea" placeholder="Bio" style={{ height: '100px' }} name="bio" value={formInput.bio} onChange={handleChange} required />
      </FloatingLabel>
      {/* name INPUT */}
      <FloatingLabel controlId="floatingInput1" label="User Color" className="mb-3">
        <Form.Control type="text" placeholder="Enter Hex# color here" name="color" value={formInput.color} onChange={handleChange} required />
      </FloatingLabel>

      <div>
        <h3>Enter the Hex color in the box above. The thin line changes the color of the rectangle below, grab and slide, user. Click the box to make it show up as a hex. Then enter the hex # in the box to change your color, thank you!</h3><a href="https://www.w3schools.com/colors/colors_picker.asp" target="_blank" rel="noreferrer">Way more trust worthy, than what&#39;s on this form...</a>
      </div>

      {/* SUBMIT BUTTON */}
      <Button type="submit">{obj.userId ? 'Update' : 'Create'} User</Button>
    </Form>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    userId: PropTypes.string,
    bio: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  obj: initialState,
};

export default UserForm;