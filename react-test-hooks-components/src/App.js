/**/
import Counter from "./components/Counter";
import TaskList from "./components/TaskList";
import UserInfo from "./components/UserInfo";
import Posts from "./components/Posts";

import './App.css';

function App() {
  return (
<div className="container">
  <h2 className="title">Moja aplikacja z komponentami</h2>
  <div className="components">
      <Counter className="component-box" />
      <TaskList className="component-box" />
      <UserInfo className="component-box" />
      <Posts className="component-box" />
  </div>
</div>
  );
}

export default App;

/*/
import { useState, useEffect } from "react";

function App() {
  // Licznik kliknięć
  const [count, setCount] = useState(0);

  // Lista zadań
  const [tasks, setTasks] = useState(["Kup mleko", "Zrób obiad"]);

  // Dane użytkownika (obiekt)
  const [user, setUser] = useState({ name: "Jan", age: 25 });

  // Pobieranie danych z API (posty)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Symulacja pobrania danych
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []); // Wywołujemy tylko raz po zamontowaniu

  // Funkcje do zmiany stanu
  const increment = () => setCount((prev) => prev + 1);
  const addTask = () => setTasks((prev) => [...prev, `Nowe zadanie ${prev.length + 1}`]);
  const updateAge = () => setUser((prev) => ({ ...prev, age: prev.age + 1 }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Aplikacja React z useState & useEffect</h1>

      <h2>Licznik: {count}</h2>
      <button onClick={increment}>Kliknij (+1)</button>

      <h2>Lista zadań</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <button onClick={addTask}>Dodaj zadanie</button>

      <h2>Dane użytkownika</h2>
      <p>Imię: {user.name}</p>
      <p>Wiek: {user.age}</p>
      <button onClick={updateAge}>Zwiększ wiek</button>

      <h2>Posty z API</h2>
      {posts.length === 0 ? (
        <p>Ładowanie postów...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
/**/