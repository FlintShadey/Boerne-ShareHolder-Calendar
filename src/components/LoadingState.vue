<template>
  <v-card class="loading-state" elevation="0" color="transparent">
    <v-card-text class="text-center py-8">
      <v-progress-circular
        v-if="loading"
        indeterminate
        :color="color"
        :size="size"
        :width="width"
      ></v-progress-circular>
      
      <div v-if="message" class="mt-4">
        <p class="text-body-1">{{ message }}</p>
      </div>

      <div v-if="error" class="mt-4">
        <v-alert
          type="error"
          variant="tonal"
          class="text-left"
        >
          <strong>Error:</strong> {{ error }}
        </v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: Number,
    default: 64
  },
  width: {
    type: Number,
    default: 6
  }
})
</script>

<style scoped>
.loading-state {
  width: 100%;
}
</style>
