import { Dispatch } from 'redux';

import { ResponseType } from 'services/api';
import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from 'store/reducers/app-reducer';

const ERROR_MESSAGE = 0;

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
): void => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[ERROR_MESSAGE]));
  } else {
    dispatch(setAppErrorAC('Some error occurred'));
  }
  dispatch(setAppStatusAC('failed'));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
): void => {
  dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'));
  dispatch(setAppStatusAC('failed'));
};
