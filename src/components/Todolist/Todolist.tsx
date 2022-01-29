import React, { useCallback } from 'react';

import { Delete } from '@mui/icons-material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { AddItemForm } from 'components/common/AddItemForm/AddItemForm';
import { EditableSpan } from 'components/common/EditableSpan/EditableSpan';
import { Task } from 'components/Task/Task';
import { TaskStatuses, TaskType } from 'services/api/api';
import { FilterValuesType, TodolistDomainType } from 'store/reducers/todolists-reducer';

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void;
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
  removeTask: (taskId: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
};

export const Todolist = React.memo((props: PropsType) => {
  const {
    todolist,
    tasks,
    changeFilter,
    addTask,
    changeTaskStatus,
    changeTaskTitle,
    removeTask,
    removeTodolist,
    changeTodolistTitle,
  } = props;

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask(title, todolist.id);
    },
    [addTask, todolist.id],
  );
  const removeTodolistOnClick = (): void => {
    removeTodolist(todolist.id);
  };
  const editTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitle(todolist.id, title);
    },
    [todolist.id, changeTodolistTitle],
  );
  const onAllClickHandler = useCallback(
    () => changeFilter('all', todolist.id),
    [todolist.id, changeFilter],
  );
  const onActiveClickHandler = useCallback(
    () => changeFilter('active', todolist.id),
    [todolist.id, changeFilter],
  );
  const onCompletedClickHandler = useCallback(
    () => changeFilter('completed', todolist.id),
    [todolist.id, changeFilter],
  );

  let tasksForTodolist = tasks;

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New);
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={editTodolistTitle} />
        <IconButton
          onClick={removeTodolistOnClick}
          disabled={todolist.entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        addItem={addTaskCallback}
        disabled={todolist.entityStatus === 'loading'}
      />
      <div>
        {tasksForTodolist.map(t => (
          <Task
            key={t.id}
            task={t}
            todolistId={todolist.id}
            removeTask={removeTask}
            changeTaskTitle={changeTaskTitle}
            changeTaskStatus={changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Button
          variant={todolist.filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
          color="inherit"
        >
          All
        </Button>
        <Button
          variant={todolist.filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          color="primary"
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
          onClick={onCompletedClickHandler}
          color="secondary"
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
