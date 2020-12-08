<template>
  <div>
    <h2>Home</h2>
    <button @click="reback">登出</button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
    reback(){
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  
  }};
</script>

<style scoped></style>
