<script>
import { ref, reactive, toRefs } from 'vue';

export default {
    props: {
        pokemonList: Array,
    },
    setup(props, { emit }) {
        const state = reactive({
            itemsPerPage: ref(10),
            searchText: ref(''),
            filteredPokemon: ref([]),
            filteredItemCount: ref(0),
            currentPage: ref(1),
        });

        const updateItemsPerPage = () => {
            emit('update-items-per-page', state.itemsPerPage);
            updateFilteredPokemon();
        };

        const updateFilteredPokemon = () => {
            // Verificar si pokemonList está definido y no es null
            if (props.pokemonList) {
                const filtered = props.pokemonList.filter((pokemon) => {
                    return pokemon.name.toLowerCase().includes(state.searchText.toLowerCase());
                });

                state.filteredItemCount = filtered.length;

                const startIndex = (state.currentPage - 1) * state.itemsPerPage;
                state.filteredPokemon = filtered.slice(startIndex, startIndex + state.itemsPerPage);

                emit('update-filtered-pokemon', {
                    filteredPokemon: state.filteredPokemon,
                    filteredItemCount: state.filteredItemCount,
                });
            }
        };
      // Exportar propiedades y métodos reactivos
        return {
            ...toRefs(state),
            updateItemsPerPage,
            updateFilteredPokemon,
        };
    },
};
</script>

<template>
    <div>
        <v-row justify="center" class="mb-4">
            <v-col cols="12" md="6">
                <v-text-field class="mt-2 mt-md-15" v-model="itemsPerPage" label="Número de Pokémon a mostrar"
                    variant="outlined" type="number" min="1" @change="updateItemsPerPage" color="blue"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field class="mt-2 mt-md-15" v-model="searchText" variant="outlined" label="Buscar Pokémon"
                    @input="updateFilteredPokemon" color="blue"></v-text-field>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
/* Estilos específicos del componente */
</style>
