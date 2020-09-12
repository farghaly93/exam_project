<template>
    
</template>

<script>
export default {
    created() {
        const path = this.$route.params.path.split('*').join('/');
        console.log(path);
       this.$router.push(path);
    },
}
</script>


