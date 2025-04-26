<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>About</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>This is the About page.</p>
        <ion-button router-link="/home">Back to Home</ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  </script>
  