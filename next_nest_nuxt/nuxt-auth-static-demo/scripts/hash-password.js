// scripts/hash-password.js
import bcrypt from 'bcryptjs';

import readline from 'node:readline';
const rl = readline.createInterface({ 
  input: process.stdin,
  output: process.stdout
});

rl.question('Podaj hasło do zahashowania: ', (password) => {
  if (!password) {
    console.error("Hasło nie może być puste.");
    rl.close();
    process.exit(1); // Zakończ z kodem błędu
  }

  const saltRounds = 12; // Możesz zwiększyć dla większego bezpieczeństwa (np. 12)
  console.log(`Generowanie hasha dla hasła (salt rounds: ${saltRounds})...`);

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error("Błąd podczas hashowania:", err);
    } else {
      console.log('\n----------------------------------------------------');
      console.log('ZAHASHOWANE HASŁO (skopiuj całą linię poniżej):');
      console.log(hash);
      console.log('----------------------------------------------------');
      console.log('Umieść ten hash w pliku .env dla odpowiedniego użytkownika.');
    }
    rl.close();
  });
});