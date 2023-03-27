import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders the app title", () => {
  render(<App />);
  const titleElement = screen.getByText("Task Manager");
  expect(titleElement).toBeInTheDocument();
});

test("renders a new task when the form is submitted", () => {
  render(<App />);
  const newTaskInput = screen.getByLabelText(/New task/i);
  const addTaskButton = screen.getByLabelText(/Add task/i);

  // Fill in the task input field and submit the form
  fireEvent.change(newTaskInput, { target: { value: "Test task" } });
  fireEvent.click(addTaskButton);

  // Check that the new task is rendered on the screen
  const taskElement = screen.getByText("Test task");
  expect(taskElement).toBeInTheDocument();
});

test("updates a task when the edit button is clicked", () => {
  render(<App />);
  const editButton = screen.getByLabelText(/Edit task/i);

  // Click the edit button
  fireEvent.click(editButton);

  // Check that the edit form is displayed
  const editFormElement = screen.getByLabelText(/Edit task form/i);
  expect(editFormElement).toBeInTheDocument();

  // Fill in the updated task name and submit the form
  const editTaskInput = screen.getByLabelText(/Updated task/i);
  fireEvent.change(editTaskInput, { target: { value: "Updated test task" } });
  fireEvent.submit(editFormElement);

  // Check that the updated task is rendered on the screen
  const taskElement = screen.getByText("Updated test task");
  expect(taskElement).toBeInTheDocument();
});

test("adds a subtask when the add subtask button is clicked", () => {
  render(<App />);
  const addSubtaskButton = screen.getByLabelText(/Add subtask/i);

  // Click the add subtask button
  fireEvent.click(addSubtaskButton);

  // Check that the add subtask form is displayed
  const addSubtaskFormElement = screen.getByLabelText(/Add subtask form/i);
  expect(addSubtaskFormElement).toBeInTheDocument();

  // Fill in the new subtask name and submit the form
  const newSubtaskInput = screen.getByLabelText(/New subtask/i);
  fireEvent.change(newSubtaskInput, { target: { value: "Test subtask" } });
  fireEvent.submit(addSubtaskFormElement);

  // Check that the new subtask is rendered on the screen
  const subtaskElement = screen.getByText("Test subtask");
  expect(subtaskElement).toBeInTheDocument();
});

test("marks a task as completed when the checkbox is clicked", () => {
  render(<App />);
  const checkbox = screen.getByLabelText(/Task completed/i);

  // Click the checkbox
  fireEvent.click(checkbox);

  // Check that the task is marked as completed
  expect(checkbox.checked).toBe(true);
});

test("deletes a task when the delete button is clicked", () => {
  render(<App />);
  const deleteButton = screen.getByLabelText(/Delete task/i);

  // Click the delete button
  fireEvent.click(deleteButton);

  // Check that the task is no longer rendered on the screen
  const taskElement = screen.queryByText("Test task");
  expect(taskElement).not.toBeInTheDocument();
});

