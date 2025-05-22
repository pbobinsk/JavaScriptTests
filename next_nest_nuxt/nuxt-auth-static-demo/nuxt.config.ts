// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
  mockUserLogin: process.env.MOCK_USER_LOGIN,
  mockUserPassword: process.env.MOCK_USER_PASSWORD,
  sessionSecret: process.env.SESSION_SECRET,
  public: {}
}
})
