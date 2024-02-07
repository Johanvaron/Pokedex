<template>
  <!-- Footer -->
  <v-footer class="pokedex-footer" color="primary" app inset>
    <v-row align="center">
      <v-col cols="6" class="d-flex justify-center align-center">
      </v-col>
      <v-col cols="6" class="text-right d-flex justify-center align-center">
      </v-col>
      <v-col cols="12" class="mt-2">
        <span class="footer-text">&copy; 2024 Pokedex. Todos los derechos reservados.</span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style scoped>
/* Estilos generales para la aplicación */
.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Contenedor de contenido con flex crecimiento */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Estilos generales para el header */

/* Estilos generales para el footer */
.pokedex-footer {
  background-color: #1e88e5;
  color: #fff;
  text-align: center;
  border-top: 15px solid #000; /* Ajusté el grosor del borde superior */
  padding: 5px 10px; /* Ajusté el espacio arriba y abajo */
}

/* Estilos para el texto del footer */
.footer-text {
  font-size: 14px;
}
</style>
