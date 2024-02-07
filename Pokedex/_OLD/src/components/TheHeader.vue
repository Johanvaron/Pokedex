<script>
export default {
  name: 'PokemonHeader',
};
</script>
<template>
  <v-app-bar app class="pokedex-header" color="blue">
    <v-img class="pokeball left-pokeball" src="../assets/hola.png" alt="Pokeball"></v-img>
    <v-spacer></v-spacer>
    <v-img class="pokedex-logo" src="../assets/logoPokemon.png" alt="Pokédex Logo"></v-img>
    <v-spacer></v-spacer>
    <v-img class="pokeball right-pokeball" src="../assets/hola.png" alt="Pokeball"></v-img>
    <!-- Puedes agregar más botones u opciones aquí -->
  </v-app-bar>
</template>
<style scoped>
/* Estilos generales para el header que se asemejan a una Pokedex */
.pokedex-header {
  border-bottom: 30px solid #000;
  position: relative;
}

/* Estilos para las pokebolas en los lados */
.left-pokeball,
.right-pokeball {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  /* Ajusta el tamaño según sea necesario */
  height: 40px;
}

.left-pokeball {
  left: 10px;
  /* Ajusta la posición según sea necesario */
}

.right-pokeball {
  right: 10px;
  /* Ajusta la posición según sea necesario */
}

/* Estilos para el logo de la Pokédex */
.pokedex-logo {
  width: 100%; /* Ocupa el 100% del ancho disponible */
  height: auto; /* Altura automática para mantener la proporción de la imagen */
}

</style>
