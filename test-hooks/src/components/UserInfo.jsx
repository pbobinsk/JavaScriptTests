import { useState } from "react";

function UserInfo() {
  const [user, setUser] = useState({ name: "Jan", age: 25 });

  return (
    <div>
      <h2>Dane użytkownika</h2>
      <p>Imię: {user.name}</p>
      <p>Wiek: {user.age}</p>
      <button onClick={() => setUser((prev) => ({ ...prev, age: prev.age + 1 }))}>
        Zwiększ wiek
      </button>
    </div>
  );
}

export default UserInfo;
