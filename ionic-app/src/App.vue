<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { defineComponent } from 'vue';
import { IonApp } from '@ionic/vue';

defineComponent({
  name: 'App'
});
</script>
