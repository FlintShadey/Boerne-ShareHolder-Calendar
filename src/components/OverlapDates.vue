<template>
  <v-card elevation="1" class="overlap-card" color="white">
    <v-card-title class="text-subtitle-1 d-flex align-center">
      <v-icon icon="mdi-calendar-multiselect" class="mr-2" size="20" />
      Dates With 3+ People Available
      <v-spacer />
      <v-chip v-if="overlapDates.length" size="small" color="primary" variant="flat">{{ overlapDates.length }}</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="!overlapDates.length" class="text-grey-darken-1 text-body-2 py-2">
        No dates currently have availability from 3 or more users.
      </div>
      <v-row v-else dense>
        <v-col
          v-for="entry in overlapDates"
          :key="entry.date"
          cols="12" sm="6" md="4" lg="3"
          class="d-flex"
        >
          <v-sheet rounded="lg" class="pa-3 flex-grow-1 overlap-date-tile">
            <div class="text-body-2 font-weight-medium mb-1">{{ entry.date }}</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="user in entry.users"
                :key="user.name"
                :style="chipStyle(user.color)"
                size="small"
                class="ma-0 overlap-user-chip"
                label
              >{{ user.name }}</v-chip>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  overlapDates: {
    type: Array,
    required: true,
    // Each item: { date: 'YYYY-MM-DD', users: [{ name, color, initials }] }
    default: () => []
  }
})

// Utility: return contrasting text color (black/white) based on luminance
function chipStyle(hex) {
  if (!hex) return {}
  const c = hex.replace('#','')
  if (c.length === 3) {
    const r = c[0]+c[0], g = c[1]+c[1], b = c[2]+c[2]
    return chipStyle('#'+r+g+b)
  }
  const r = parseInt(c.substr(0,2),16)
  const g = parseInt(c.substr(2,2),16)
  const b = parseInt(c.substr(4,2),16)
  // Perceived luminance
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255
  const textColor = luminance > 0.6 ? '#1d1d1d' : '#FFFFFF'
  // Slight transparency ring for light backgrounds
  return {
    backgroundColor: hex,
    color: textColor,
    border: '1px solid rgba(0,0,0,0.15)'
  }
}
</script>

<style scoped>
.overlap-card {
  margin-top: 32px;
}

.overlap-date-tile {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  transition: box-shadow .2s ease, transform .2s ease;
}

.overlap-date-tile:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.gap-1 { gap: 4px; }
</style>