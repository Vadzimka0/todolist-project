import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import { AddBox } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

type AddItemFormPropsType = {
  addItem: (title: string) => void;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
};

export const AddItemForm = React.memo(
  ({ addItem, disabled = false }: AddItemFormPropsType) => {
    console.log('AddItemForm called');

    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addItemHandler = (): void => {
      if (title.trim() !== '') {
        addItem(title);
        setTitle('');
      } else {
        setError('Title is required');
      }
    };
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
      setTitle(e.currentTarget.value);
    };
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>): void => {
      if (error !== null) {
        setError(null);
      }
      if (e.code === 'Enter') {
        addItemHandler();
      }
    };

    return (
      <div>
        <TextField
          variant="outlined"
          disabled={disabled}
          error={!!error}
          value={title}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          label="Title"
          helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
          <AddBox />
        </IconButton>
      </div>
    );
  },
);
