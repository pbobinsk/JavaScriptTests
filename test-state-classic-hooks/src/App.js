/**/
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0, // Definiujemy stan w konstruktorze
    };
  }

  componentDidMount() {
    console.log("Komponent zamontowany!");
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 })); // Aktualizacja stanu
  };

  render() {
    return (
      <div>
        <h1>Licznik: {this.state.count}</h1>
        <button onClick={this.increment}>Zwiększ</button>
      </div>
    );
  }
}

export default Counter;
/*/
import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0); // useState przechowuje stan

  useEffect(() => {
    console.log("Komponent zamontowany!"); // useEffect działa jak componentDidMount
  }, []);

  return (
    <div>
      <h1>Licznik: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Zwiększ</button>
    </div>
  );
}

export default Counter;
/**/