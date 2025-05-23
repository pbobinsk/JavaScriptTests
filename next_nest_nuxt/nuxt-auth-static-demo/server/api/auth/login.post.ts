// server/api/auth/login.post.ts
import { defineEventHandler, readBody, setCookie, createError } from 'h3';
import bcrypt from 'bcryptjs'; // lub import * as bcrypt from 'bcryptjs';

interface UserConfig { // Definicja typu
  login?: string;
  hashedPassword?: string;
  id?: string;
  roles?: string[];
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event); // Oczekujemy { login: '...', password: '...' }

  if (!body.login || !body.password) {
    throw createError({ statusCode: 400, message: 'Login i hasło są wymagane.' });
  }

  const usersArray = config.users as UserConfig[]; // Mówimy TS: "ufaj mi, to jest tablica UserConfig"

  // Znajdź użytkownika w skonfigurowanej liście
  // const foundUserConfig = config.users.find(
  //   (user: { login?: string }) => user.login === body.login
  // );

  const foundUserConfig = usersArray.find(
    (user) => user.login === body.login // TS teraz wie, że user to UserConfig
  );

  if (!foundUserConfig || !foundUserConfig.hashedPassword) {
    // Użytkownik nie istnieje w konfiguracji lub brakuje hasha
    console.warn(`Próba logowania dla nieznanego użytkownika lub brak hasha: ${body.login}`);
    throw createError({ statusCode: 401, message: 'Nieprawidłowy login lub hasło.' });
  }

  // Porównaj podane hasło z zahashowanym hasłem
  const passwordsMatch = await bcrypt.compare(body.password, foundUserConfig.hashedPassword as string);

  if (passwordsMatch) {
    // Hasła pasują, utwórz sesję
    const userSession = {
      id: foundUserConfig.id as string,
      login: foundUserConfig.login as string,
      roles: foundUserConfig.roles as string[] || [], // Przekaż role do sesji
    };

    setCookie(event, 'user-session', JSON.stringify(userSession), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      // secure: process.env.NODE_ENV === 'production', // W produkcji
      // sameSite: 'lax', // Zalecane
    });

    console.log(`Użytkownik ${userSession.login} zalogowany pomyślnie.`);
    return { user: userSession };
  } else {
    // Hasła nie pasują
    console.warn(`Nieudana próba logowania dla użytkownika: ${body.login}`);
    throw createError({ statusCode: 401, message: 'Nieprawidłowy login lub hasło.' });
  }
});