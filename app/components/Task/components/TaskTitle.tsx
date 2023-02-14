import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import styled from '@emotion/native';

import { TaskData, TaskStates } from 'types/task';

const StyledInput = styled(TextInput)`
  background-color: transparent;
  flex: 1;
  font-family: 'NunitoSans';
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
`;

const StyledInput__Archived = styled(StyledInput)`
  color: #aaa;
  text-decoration-line: line-through;
  text-decoration-style: solid;
`;

export type Props = {
  task: TaskData;
  onEndEditing: (id: string, title: string, state?: TaskStates) => void;
  onFocus: () => void;
  onSubmitEditing: (id: string, title: string) => void;
};

export function TaskTitle({
  task,
  onEndEditing,
  onFocus,
  onSubmitEditing,
}: Props) {
  const [title, setTitle] = useState(task.title);
  const titleRef = useRef(task.title);

  const { id, state } = task;

  const returnKeyType = title ? 'next' : 'done';

  useEffect(() => {
    // When a 'Back' button pressed, we navigate to the Home screen and unmount the TaskList component immediately.
    // When this happens, the `TextInput` component won't fire any of its "exit" events, i.e., `onBlur`, `onEndEditing`,
    // `onSubmitEditing`, - no of these events will be triggered. If the user edited some task and then pressed "Back",
    // they will lose this last edit, so we attempt to save their work before the TaskTitle component unmounts.
    //
    // We call for save only if there are any unsaved changes to avoid the waste work (otherwise, if the list contains many tasks,
    // each will call for a save, despite that only one task can be edited at a moment).
    return () => {
      // console.log(`Unmounting task "${id}" with title "${title}" (previous title = "${task.title}", title Ref: "${titleRef.current}")`);
      if (titleRef.current !== task.title) {
        // console.log('There are some unsaved changes');
        onEndEditing(id, titleRef.current);
      }
    }
  }, []);

  const changeTitle = (value: string) => {
    setTitle(value);
    titleRef.current = value;
  };

  /**
   * Newly created task.
   * When created:
   *   * Empty
   *   * Input is focused into it
   *   * We enter the "Edit mode", with "Done" button appearing in th etop-right corner
   *
   * When typing into it:
   *   * We see what we type immediately, with no lags or delays
   *
   * When hitting the 'Return' button (on the keyboard):
   *   * If we have some data (title) for this task, save it and add a new task for editing;
   *   * If we don't have any data (title) for this task, delete it and exit the "Edit mode"
   *
   * When hitting the "Done" button (at the top-right corner of the screen, the indicator of "edit mode"):
   *   * If we have some data (title) for this task, save it and and exit the "Edit mode";
   *   * If we don't have any data (title) for this task, delete it and exit the "Edit mode"
   */
  if (state === TaskStates.TASK_NEW) {
    return (
      <StyledInput
        autoFocus={true}
        value={title}
        onChange={(e) => changeTitle(e.nativeEvent.text)}

        // Called when text input ends.
        // https://reactnative.dev/docs/textinput?redirected#onendediting
        onEndEditing={() => {
          // console.log(`End editing task "${id}" with title "${title}"`);
          onEndEditing(id, title, TaskStates.TASK_INBOX);
        }}
        onFocus={onFocus}
        // This event means the text input's submit button is pressed
        onSubmitEditing={() => {
          // console.log(`Submit edit task "${id}" with title "${title}"`);
          onSubmitEditing(id, title);
        }}
        returnKeyType={returnKeyType}
      />
    );
  }

  /**
   * Existing task.
   * When clicked:
   *   * Receives focus
   *   * We enter the "Edit mode", with "Done" button appearing in th etop-right corner
   *
   * When typing into it:
   *   * We see what we type immediately, with no lags or delays
   *
   * When hitting the 'Return' button (on the keyboard):
   *   * If we have some data (title) for this task, save it and add a new task for editing;
   *   * If we don't have any data (title) for this task after editing it, delete it and exit the "Edit mode"
   *
   * When hitting the "Done" button (at the top-right corner of the screen, the indicator of "edit mode"):
   *   * If we have some data (title) for this task, save it and and exit the "Edit mode";
   *   * If we don't have any data (title) for this task, delete it and exit the "Edit mode"
   */
  if (state === TaskStates.TASK_PINNED || state === TaskStates.TASK_INBOX) {
    return (
      <StyledInput
        value={title}
        onChange={(e) => changeTitle(e.nativeEvent.text)}
        onEndEditing={() => {
          // console.log(`End editing task "${id}" with title "${title}"`);
          onEndEditing(id, title);
        }}
        onSubmitEditing={() => {
          // console.log(`Submit edit task "${id}" with title "${title}"`);
          onSubmitEditing(id, title);
        }}
        // onBlur={() => console.log(`Task blurred: "${id}", title: "${title}"`)}
        onFocus={onFocus}
        returnKeyType={returnKeyType}
      />
    );
  }

  if (state === TaskStates.TASK_ARCHIVED) {
    return (
      <StyledInput__Archived
        value={title}
        editable={false}
      />
    );
  }

  return null;
}
