<script>
export default {
  name: 'App',
};
</script>

<template>
            <!-- Footer -->
      <v-footer class="pokedex-footer" color="blue" fixed padless>
        <v-row justify="center" align="center">
          <span class="footer-text">© 2024 Pokedex. Todos los derechos reservados.</span>
        </v-row>
      </v-footer>
</template>

<style scoped>
/* Estilos generales para la aplicación */
.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Cambié la propiedad 'height' a 'min-height' */
}

/* Contenedor de contenido con flex crecimiento */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Estilos generales para el header */
.pokedex-header {
  border-bottom: 2px solid #000; /* Reduje el grosor del borde */
}

/* Estilos generales para el footer */
.pokedex-footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  border-top: 2px solid #000; /* Reduje el grosor del borde */
}

/* Estilos para el texto del footer */
.footer-text {
  font-size: 14px;
  /* Otros estilos de texto según sea necesario */
}
</style>
