<template>
  <v-card class="user-selector" elevation="0" color="transparent">
    <v-card-text class="pa-2">
      <div class="d-flex flex-wrap gap-2 justify-center">
        <v-chip
          v-for="(user, index) in users"
          :key="user.name"
          :color="isActiveUser(index) ? user.displayColor : 'grey-lighten-3'"
          :variant="isActiveUser(index) ? 'flat' : 'flat'"
          :style="{
            borderColor: user.displayColor,
            borderWidth: isActiveUser(index) ? '0px' : '2px',
            borderStyle: 'solid'
          }"
          class="user-chip"
          size="large"
          @click="selectUser(index)"
        >
          <v-avatar :color="user.color" size="24" class="mr-2">
            <span class="text-caption" :style="{ color: '#FFFFFF' }">{{ getUserInitials(user.name) }}</span>
          </v-avatar>
          <span :style="{ color: isActiveUser(index) ? user.textColor : '#424242' }">
            {{ user.name }}
          </span>
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useUsers } from '../composables/useUsers'

const { users, setActiveUser, isActiveUser } = useUsers()

const selectUser = (index) => { setActiveUser(index) }

const getUserInitials = (name) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
</script>

<style scoped>
.user-selector { width: 100%; }
.user-chip { cursor: pointer; transition: all 0.3s ease; font-weight: 500; }
.user-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
.gap-2 { gap: 8px; }
</style>
