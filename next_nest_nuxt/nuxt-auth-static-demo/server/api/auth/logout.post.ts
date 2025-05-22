// server/api/auth/logout.post.ts
import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
    console.log('LOGOUT: Próba usunięcia ciasteczka user-session'); // Dodaj log
  deleteCookie(event, 'user-session', {
    
    path: '/', // Upewnij się, że path jest taki sam jak przy ustawianiu
  });
  return { message: 'Wylogowano pomyślnie' };
});