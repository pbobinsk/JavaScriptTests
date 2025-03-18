import { useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState(["Kup mleko", "Zrób obiad"]);

  const addTask = () => {
    setTasks((prev) => [...prev, `Nowe zadanie ${prev.length + 1}`]);
  };

  return (
    <div>
      <h2>Lista zadań</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <button onClick={addTask}>Dodaj zadanie</button>
    </div>
  );
}

export default TaskList;
