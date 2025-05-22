// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, setUser } = useAuth(); // Użyj naszego composable

  // Jeśli stan użytkownika nie jest jeszcze ustawiony (np. pierwsze ładowanie, odświeżenie)
  // próbujemy go załadować z endpointu /api/auth/status
  // Ten endpoint odczyta ciasteczko po stronie serwera
  if (process.server && !user.value) {
    try {
      // $fetch jest dostępne globalnie w Nuxt 3, robi żądania API
      const data = await $fetch<{ loggedIn: boolean; user: any }>('/api/auth/status', {
        // Ważne: Przekazuj nagłówki z oryginalnego żądania, aby ciasteczka były dostępne
        // Jednak $fetch wykonane na serwerze w kontekście serwera Nitro
        // automatycznie powinno mieć dostęp do ciasteczek oryginalnego żądania
        // dla żądań do własnego API.
      });
      if (data.loggedIn && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania statusu autentykacji:', error);
      setUser(null);
    }
  }
  
  // Logika ochrony tras
  const protectedRoutes = ['/protected-content']; // Lista chronionych ścieżek

  if (protectedRoutes.includes(to.path)) {
    if (!user.value) {
      // Jeśli użytkownik nie jest zalogowany (sprawdzamy stan `user` z useAuth,
      // który powinien być zsynchronizowany z ciasteczkiem dzięki powyższej logice)
      // i próbuje uzyskać dostęp do chronionej trasy
      console.log(`Dostęp do ${to.path} zabroniony, przekierowanie do /login`);
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
    }
  }

  // Logika dla strony logowania - jeśli użytkownik jest już zalogowany, przekieruj go
  if (to.path === '/login' && user.value) {
    console.log('Użytkownik zalogowany próbuje wejść na /login, przekierowanie do /');
    return navigateTo('/');
  }
});