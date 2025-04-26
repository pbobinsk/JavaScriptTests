<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>Welcome to Home!</p>
        <ion-button router-link="/about">Go to About</ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  </script>
  