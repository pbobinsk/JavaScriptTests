// server/api/auth/status.get.ts
import { defineEventHandler, getCookie } from 'h3';

export default defineEventHandler((event) => {
  const userSessionCookie = getCookie(event, 'user-session');

  if (userSessionCookie) {
    try {
      const user = JSON.parse(userSessionCookie);
      return { loggedIn: true, user };
    } catch (e) {
      return { loggedIn: false, user: null };
    }
  }
  return { loggedIn: false, user: null };
});