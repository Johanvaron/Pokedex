<template>
  
    <TheHeader/>
    <TheFilterAndPagination/>
    <ThePokedex/>
    <TheFooter/>
    
   
</template>

<script>
import TheFilterAndPagination from '@/components/TheFilterAndPagination.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader'
import ThePokedex from '@/components/ThePokedex'
export default {
  components: {
    TheHeader,
    ThePokedex,
    TheFilterAndPagination,
    TheFooter
}
};
</script>
