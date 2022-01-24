import React, { ReactElement } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { LoginParamsType } from 'services/api';
import { loginTC } from 'store/reducers/auth-reducer';
import { AppRootStateType } from 'store/store';

export const Login = (): ReactElement => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    state => state.auth.isLoggedIn,
  );

  const MIN_PASSWORD_LENGTH = 0;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: values => {
      const errors: Partial<Omit<LoginParamsType, 'captcha'>> = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < MIN_PASSWORD_LENGTH) {
        errors.password = 'Must be 5 characters or more';
      }
      return errors;
    },
    onSubmit: values => {
      dispatch(loginTC(values));
      formik.resetForm();
    },
  });

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item justifyContent="center">
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href="https://social-network.samuraijs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {' '}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label="Remember me"
                control={<Checkbox {...formik.getFieldProps('rememberMe')} />}
              />
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
