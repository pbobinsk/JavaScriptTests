import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Licznik: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Kliknij (+1)</button>
    </div>
  );
}

export default Counter;
