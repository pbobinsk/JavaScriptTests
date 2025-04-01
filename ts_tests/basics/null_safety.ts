type User = { name: string; age?: number };

function getUserName(user: User | null): string {
  return user?.name ?? "Anonim";
}

console.log(getUserName({ name: "Jan" })); // "Jan"
console.log(getUserName(null)); // "Anonim"
console.log(getUserName({ name: "Ala", age: 25 })); // "Ala"
