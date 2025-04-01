"use strict";
// Funkcja, która przyjmuje obiekt User i zwraca jego dane w formie stringa
function displayUserInfo(user) {
    return `Użytkownik: ${user.name} (${user.email}), aktywny: ${user.isActive ? "Tak" : "Nie"}`;
}
// Przykłady użycia:
const user1 = { id: 1, name: "Anna", email: "anna@example.com", isActive: true };
const user2 = { id: 2, name: "Jan", email: "jan@example.com", isActive: false };
console.log(displayUserInfo(user1)); // "Użytkownik: Anna (anna@example.com), aktywny: Tak"
console.log(displayUserInfo(user2)); // "Użytkownik: Jan (jan@example.com), aktywny: Nie"
// Niepoprawne przypisanie wywoła błąd kompilacji!
//   const user3: TypeSafety.User = { id: 3, name: "Piotr", email: "piotr@example.com" };
// Brakuje właściwości isActive!
