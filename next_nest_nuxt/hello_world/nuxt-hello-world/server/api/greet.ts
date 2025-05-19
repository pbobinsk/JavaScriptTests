// server/api/greet.ts
export default defineEventHandler((event) => {
  // event.context zawiera informacje o żądaniu
  // np. event.req, event.res w środowisku Node.js
  // lub event.node.req, event.node.res
  return {
    message: 'Greetings from Nuxt 3 API!'
  }
})