import React, { useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "Pending",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showTasks, setShowTasks] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleShowTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        setTasks(res.data);
        setShowTasks(true);
      })
      .catch((err) => console.log(err));
  };

  const handleHideTasks = () => {
    setShowTasks(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      handleUpdate();
    } else {
      axios
        .post("http://localhost:5000/api/tasks", newTask)
        .then((res) => {
          setTasks([...tasks, res.data]);
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setNewTask(task);
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/tasks/${editingTask.id}`, newTask)
      .then((res) => {
        setTasks(tasks.map((task) => (task.id === editingTask.id ? res.data : task)));
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      due_date: "",
      status: "Pending",
    });
    setEditingTask(null);
  };

  return (
    <div className="bg-[#151520] min-h-screen py-10 px-4 sm:px-8">
      <h1 className="text-4xl font-extrabold text-yellow-300 text-center mb-8">
        Task Management System
      </h1>

      <div className="text-center mb-8">
        {!showTasks ? (
          <button
            onClick={handleShowTasks}
            className="bg-[#50fa7b] text-black py-2 px-6 rounded-lg shadow-md hover:bg-[#3ad766] transition-transform transform hover:scale-105"
          >
            Show Tasks
          </button>
        ) : (
          <button
            onClick={handleHideTasks}
            className="bg-[#ff5555] text-white py-2 px-6 rounded-lg shadow-md hover:bg-[#ff4444] transition-transform transform hover:scale-105"
          >
            Hide Tasks
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-[#282a36] p-6 rounded-lg shadow-lg">
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Task Title"
          className="w-full mb-4 p-2 border border-[#6272a4] rounded-lg bg-[#1e1e2e] text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#ff79c6]"
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="w-full mb-4 p-2 border border-[#6272a4] rounded-lg bg-[#1e1e2e] text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#8be9fd]"
        />
        <input
          type="date"
          name="due_date"
          value={newTask.due_date}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-[#6272a4] rounded-lg bg-[#1e1e2e] text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#ffb86c]"
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border border-[#6272a4] rounded-lg bg-[#1e1e2e] text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#bd93f9]"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg text-black ${
            editingTask ? "bg-[#ffb86c] hover:bg-[#fca15e]" : "bg-[#8be9fd] hover:bg-[#7ae1f7]"
          } transition-transform transform hover:scale-105`}
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      {showTasks && (
        <ul className="mt-10 flex flex-wrap gap-4 justify-center">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-[#6ba014] text-white p-6 rounded-lg shadow-md transition transform hover:scale-105 break-words w-80"
            >
              <h3 className="text-2xl font-semibold mb-2">{task.title}</h3>
              <p className="mb-4">{task.description}</p>
              <p className="text-sm">Due Date: {task.due_date}</p>
              <p className="text-sm text-white">Status: {task.status}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEditClick(task)}
                  className="bg-[#bd93f9] text-black py-1 px-4 rounded-lg hover:bg-[#aa82e5] transition-transform transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-[#ff5555] text-white py-1 px-4 rounded-lg hover:bg-[#ff4444] transition-transform transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
