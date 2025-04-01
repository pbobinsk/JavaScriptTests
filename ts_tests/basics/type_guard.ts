type Employee = { name: string; position: string };
type Student = { name: string; course: string };
type Person = Employee | Student;

function isEmployee(person: Person): person is Employee {
  return "position" in person;
}

function isStudent(person: Person): person is Student {
  return "course" in person;
}

// Przykłady
const p1: Person = { name: "Anna", position: "Manager" };
const p2: Person = { name: "Jan", course: "Math" };

console.log(isEmployee(p1)); // true
console.log(isStudent(p2));  // true


function hasProperty<T extends object, K extends keyof T>(obj: T, key: K): boolean {
    return key in obj;
  }
  
  console.log(hasProperty(p1, "position")); // true
  console.log(hasProperty(p2, "course"));   // true
  