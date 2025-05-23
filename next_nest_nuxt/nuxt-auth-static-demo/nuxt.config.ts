// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET,
    users: [
      {
        login: process.env.USER_ADMIN_LOGIN,
        hashedPassword: process.env.USER_ADMIN_HASHED_PASSWORD,
        id: '1',
        roles: ['admin', 'user'] 
      },
      {
        login: process.env.USER_REGULAR_LOGIN,
        hashedPassword: process.env.USER_REGULAR_HASHED_PASSWORD,
        id: '2',
        roles: ['user']
      },
    ].filter(user => user.login && user.hashedPassword), 
    public: {}
}
})
