<script setup>
import Counter from "./components/Counter.vue";
import Counter2 from "./components/Counter2.vue";
import TaskList from "./components/TaskList.vue";
import UserInfo from "./components/UserInfo.vue";
import Posts from "./components/Posts.vue";
</script>

<template>
  <div style="padding: 20px; font-family: Arial">
    <h1>Aplikacja Vue 3 z ref & onMounted</h1>
    <Counter />
    <Counter2 />
    <TaskList />
    <UserInfo />
    <Posts />
  </div>
</template>
