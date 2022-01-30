import React, { ReactElement, useEffect } from 'react';

import { Menu } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ErrorSnackbar } from 'components/common/ErrorSnackbar/ErrorSnackbar';
import { Login } from 'components/Login/Login';
import { TodolistsList } from 'components/TodolistList/TodolistsList';
import { initializeAppTC, RequestStatusType } from 'store/reducers/app-reducer';
import { logoutTC } from 'store/reducers/auth-reducer';
import { AppRootStateType } from 'store/store';

type PropsType = {
  demo?: boolean;
};

const App = ({ demo = false }: PropsType): ReactElement => {
  const dispatch = useDispatch();
  const isInitialized = useSelector<AppRootStateType, boolean>(
    state => state.app.isInitialized,
  );
  const status = useSelector<AppRootStateType, RequestStatusType>(
    state => state.app.status,
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    state => state.auth.isLoggedIn,
  );

  useEffect(() => {
    if (demo || !isLoggedIn) {
      dispatch(initializeAppTC());
    }
  }, [demo, dispatch, isLoggedIn]);

  const onClickLogout = (): void => {
    dispatch(logoutTC());
  };

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {/* <Button color="inherit">{isLoggedIn ? "Log Out" : "Log In"}</Button> */}
          {isLoggedIn && (
            <Button color="inherit" onClick={onClickLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="login" element={<Login />} />
          <Route path="/404" element={<h1>404 :(</h1>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
