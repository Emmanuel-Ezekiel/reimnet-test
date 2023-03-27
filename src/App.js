import React, { useState, useEffect } from "react";
import "./App.scss";
import { v4 as uuidv4 } from "uuid";
import { MdAddCircle } from "react-icons/md";
import { BsCalendar } from "react-icons/bs";
import { TbSubtask } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { RiArrowDropUpLine } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const colors = [
  "#FF5733",
  "#DAF7A6",
  "#C70039",
  "#900C3F",
  "#581845",
  "green",
  "blue",
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [taskId2, setTaskId2] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [completed, setCompleted] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);


  const handleEditTask = (id) => {
    setTaskId((prevTaskId) => (prevTaskId === id ? null : id));
    setUpdatedTask("");
  };

  const handleSubTask = (id) => {
    setTaskId2((prevTaskId) => (prevTaskId === id ? null : id));
    setUpdatedTask("");
  };

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // add task
  const addTask = (task) => {
    const newTask = {
      id: uuidv4(),
      task,
      subtasks: [],
      completed: false,
      timestamp: new Date().toISOString(), // Add timestamp property
    };
    setTasks([...tasks, newTask]);
  };

  //update
  const updateTask = (taskId, updatedTask) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          task: updatedTask,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setTaskId(null);
  };

  // add sub tasks
  const addSubtask = (taskId, subtask) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [...task.subtasks, subtask],
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setTaskId2(null);
  };

  // mark task
  const markComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed, // toggle the completed property
          };
        } else {
          return task;
        }
      })
    );
  };

  // days format
  const formatTimestamp = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString(); // or another format
    }
  };

  // delete task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // submit
  const submit = (e) => {
    e.preventDefault();
    addTask(newTask);
    setNewTask("");
  };


  const handleDragEnd = (e) => {
    setDraggedTask(null);
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const taskIndex = tasks.findIndex((task) => task.id === Number(taskId));
    const newTasks = [...tasks];
    const [removedTask] = newTasks.splice(taskIndex, 1);
    newTasks.splice(0, 0, removedTask);
    setTasks(newTasks);
  }


 

  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDrop(e, destination) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const taskIndex = tasks.findIndex((task) => task.id === Number(taskId));
    const newTasks = [...tasks];
    const [removedTask] = newTasks.splice(taskIndex, 1);
    removedTask.order = destination;
    newTasks
      .filter((task) => task.order >= destination)
      .forEach((task) => {
        task.order += 1;
      });
    newTasks.splice(destination - 1, 0, removedTask);
    setTasks(newTasks);
  }

  return (
    <div className="App">
      <div className="item-container">
        <h1>Todo List</h1>

        <form onSubmit={submit}>
          <MdAddCircle
            style={{
              color: "rgb(206, 13, 109)",
              width: "30px",
              height: "30px",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </form>

        <h1>Tasks - {tasks?.length}</h1>

        <ul>
          {tasks?.length > 0 &&
            tasks?.map((task, index) => (
              <>
                <li
                  key={task?.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  {" "}
                  <div className="custom-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => markComplete(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="details">
                    <p>{task.task} </p>
                    <div className="subContainer">
                      <TbSubtask
                       
                        style={{
                          width: "15px",
                          height: "15px",
                        
                        }}
                      />{" "}
                      0/{task.subtasks?.length}
                      <span style={{ color: colors[index % colors.length] }}>
                        {" "}
                        <BsCalendar
                          style={{
                            width: "10px",
                            height: "10px",
                          }}
                        />{" "}
                        {formatTimestamp(task.timestamp)}
                        <div className="delete">
                          <RiDeleteBin5Line
                            onClick={() => deleteTask(task.id)}
                          />
                          <AiOutlineEdit
                            onClick={() => handleEditTask(task.id)}
                          />
                        </div>
                      </span>
                    </div>
                  </div>
                  <RiArrowDropUpLine
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "#ffffff",
                      marginLeft: "280px",
                      cursor: "pointer",
                      
                    }}
                    onClick={() => handleSubTask(task.id)}
                  />
                </li>
                {taskId2 === task.id ? (
                  <>
                    <ul>
                      {task.subtasks.map((subtask) => (
                        <li key={subtask}>
                          {" "}
                          <div className="custom-checkbox">
                            <label>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => markComplete(subtask[index])}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          {subtask}
                        </li>
                      ))}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addSubtask(task.id, newSubtask);
                          setNewSubtask("");
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Enter subtask"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                        />
                      </form>
                    </ul>
                  </>
                ) : null}

                {taskId === task.id ? (
                  <>
                    {" "}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateTask(task?.id, updatedTask);
                      }}
                      className="editInput"
                    >
                      <input
                        type="text"
                        placeholder="Edit task"
                        value={updatedTask}
                        onChange={(e) => setUpdatedTask(e.target.value)}
                      />
                    </form>
                  </>
                ) : null}
              </>
            ))}

          <h1>Completed</h1>
          <ul
            className="destination"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {tasks
              .filter((task) => task.order)
              .map((task) => (
                <li key={task.id} className="completed-task">
                  {" "}
                  <div className="custom-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => markComplete(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <p>{task.task} </p>
                </li>
              ))}
          </ul>
        </ul>
      </div>
    </div>
  );
}

export default App;
