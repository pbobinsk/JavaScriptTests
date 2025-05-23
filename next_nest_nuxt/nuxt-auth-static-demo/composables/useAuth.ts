// composables/useAuth.ts
import { type H3Event } from 'h3' // Typ dla eventu serwerowego Nitro

// Typ dla użytkownika (można rozbudować)
interface User {
  id: string;
  login: string;
  roles?: string[]; // Dodane role
}

export const useAuth = () => {
  // `useState` jest reaktywne i współdzielone (SSR/CSR)
  const user = useState<User | null>('user', () => null);

  // W Nuxt 3, ciasteczka są zarządzane inaczej.
  // Dla operacji na ciasteczkach po stronie serwera (np. w API routes, server middleware, load functions)
  // używamy `getCookie`, `setCookie`, `deleteCookie` z 'h3'.
  // Po stronie klienta, możemy użyć `document.cookie` lub biblioteki jak `js-cookie`.
  // Dla uproszczenia, i aby pokazać integrację, stworzymy endpointy API do logowania/wylogowywania.

  const isLoggedIn = computed(() => !!user.value);

  // Funkcja do ustawiania użytkownika (np. po zalogowaniu)
  // Ta funkcja byłaby wywoływana po stronie klienta po odpowiedzi z API logowania
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  // Funkcja do sprawdzania i ustawiania użytkownika na podstawie ciasteczka (wywoływana w app.vue lub middleware)
  // W Nuxt 3, to lepiej zrobić w middleware lub pluginie, który ma dostęp do `event` serwerowego
  // lub użyć `useRequestEvent` w setupie komponentu/layoutu.

  return {
    user,
    isLoggedIn,
    setUser,
  };
};

// Dodatkowy composable do odczytu ciasteczka po stronie klienta (dla prostoty)
// W praktyce, stan 'user' powinien być jedynym źródłem prawdy po hydracji.
export const useAuthClient = () => {
  const getSessionCookie = (): User | null => {
    if (process.server) return null; // Tylko na kliencie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-session='))
      ?.split('=')[1];
    if (cookieValue) {
      try {
        // Zakładamy, że ciasteczko przechowuje JSON string użytkownika
        // W bardziej zaawansowanym przypadku, to byłby token JWT
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  return { getSessionCookie };
}