function isEmployee(person) {
    return "position" in person;
}
function isStudent(person) {
    return "course" in person;
}
// Przykłady
var p1 = { name: "Anna", position: "Manager" };
var p2 = { name: "Jan", course: "Math" };
console.log(isEmployee(p1)); // true
console.log(isStudent(p2)); // true
function hasProperty(obj, key) {
    return key in obj;
}
console.log(hasProperty(p1, "position")); // true
console.log(hasProperty(p2, "course")); // true
