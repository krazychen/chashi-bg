<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="$route.path" />
    </transition>
  </div>
</template>

<script>
export default {
  
}
</script>
