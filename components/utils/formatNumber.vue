<template>

    <span>{{ format(value) }}</span>

  
</template>

<script>

export default {
    
    props: ['value'],

    data: () => ({

    }),

    methods: {

        format(value){
            return Intl.NumberFormat( 'en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);

        }

    }



}
</script>

<style>

</style>