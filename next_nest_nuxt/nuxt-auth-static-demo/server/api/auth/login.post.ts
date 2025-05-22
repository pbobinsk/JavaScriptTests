// server/api/auth/login.post.ts
import { defineEventHandler, readBody, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event); // Dostęp do runtimeConfig
  const body = await readBody(event);

  if (body.login === config.mockUserLogin && body.password === config.mockUserPassword) {
    const userSession = {
      id: '1', // Przykładowe ID
      login: body.login,
    };

    // Ustaw ciasteczko. W produkcji użyj bezpieczniejszych opcji (HttpOnly, Secure, SameSite, expires/maxAge)
    // i tokena JWT zamiast obiektu użytkownika.
    setCookie(event, 'user-session', JSON.stringify(userSession), {
      httpOnly: true, // Ciasteczko niedostępne dla JavaScriptu po stronie klienta
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      // secure: process.env.NODE_ENV === 'production', // Używaj tylko przez HTTPS w produkcji
      // sameSite: 'lax',
    });

    return { user: userSession };
  } else {
    // Użyj `createError` z Nuxta do zwracania błędów HTTP
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Nieprawidłowy login lub hasło.',
    });
  }
});