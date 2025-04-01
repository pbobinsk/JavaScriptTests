"use strict";
function getUserName(user) {
    var _a;
    return (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "Anonim";
}
console.log(getUserName({ name: "Jan" })); // "Jan"
console.log(getUserName(null)); // "Anonim"
console.log(getUserName({ name: "Ala", age: 25 })); // "Ala"
