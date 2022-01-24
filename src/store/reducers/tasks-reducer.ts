import { Dispatch } from 'redux';

import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from './app-reducer';
import {
  AddTodolistActionType,
  ClearDataActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
} from './todolists-reducer';

import {
  ResponseResult,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from 'services/api';
import { AppRootStateType } from 'store/store';
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils';

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType,
): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId),
      };
    case 'ADD-TASK':
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]],
      };
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t =>
          t.id === action.taskId ? { ...t, ...action.model } : t,
        ),
      };
    case 'REMOVE-TODOLIST': {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }
    case 'ADD-TODOLIST':
      return { ...state, [action.todolist.id]: [] };
    case 'SET-TODOLISTS': {
      const copyState = { ...state };
      action.todolists.forEach(tl => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case 'SET-TASKS':
      return { ...state, [action.todolistId]: action.tasks };
    case 'CLEAR-DATA':
      return {};
    default:
      return state;
  }
};

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: 'REMOVE-TASK', taskId, todolistId } as const);
export const addTaskAC = (task: TaskType) => ({ type: 'ADD-TASK', task } as const);
export const updateTaskAC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string,
) =>
  ({
    type: 'UPDATE-TASK',
    model,
    todolistId,
    taskId,
  } as const);
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({
    type: 'SET-TASKS',
    tasks,
    todolistId,
  } as const);

// thunks
export const fetchTasksTC =
  (todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.getTasks(todolistId).then(res => {
      const tasks = res.data.items;
      dispatch(setTasksAC(tasks, todolistId));
      dispatch(setAppStatusAC('succeeded'));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(() => {
      const action = removeTaskAC(taskId, todolistId);
      dispatch(action);
    });
  };
export const addTaskTC =
  (title: string, todolistId: string) =>
  (dispatch: Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI
      .createTask(todolistId, title)
      .then(res => {
        if (res.data.resultCode === ResponseResult.Succesful) {
          const task = res.data.data.item;
          const action = addTaskAC(task);
          dispatch(action);
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((t: TaskType) => t.id === taskId);
    if (!task) {
      // throw new Error('task not found in the state');
      // console.warn('task not found in the state');
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === ResponseResult.Succesful) {
          const action = updateTaskAC(taskId, domainModel, todolistId);
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | ReturnType<typeof setTasksAC>
  | ClearDataActionType;
type ThunkDispatch = Dispatch<
  ActionsType | SetAppStatusActionType | SetAppErrorActionType
>;
