<template>
  <v-app>
    <v-main>
      <!-- Hero Section -->
      <v-container class="hero-section py-4">
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <div class="logo-container mb-4">
              <v-img
                :src="config.logoPath"
                class="hero-logo mx-auto"
                contain
                @error="onLogoError"
              ></v-img>
            </div>
            <h1 class="hero-title font-weight-bold mb-1">
              {{ config.appShortName }}
            </h1>
            <p class="hero-subtitle text-grey-darken-1 mb-3">
              ShareHolder Availability Calendar
            </p>
            <v-chip
              :color="realtimeConnected ? 'success' : 'warning'"
              variant="tonal"
              size="small"
              class="mb-4"
            >
              <v-icon
                :icon="realtimeConnected ? 'mdi-wifi' : 'mdi-wifi-off'"
                size="small"
                class="mr-1"
              ></v-icon>
              {{ realtimeConnected ? 'Connected' : 'Demo Mode' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>

      <!-- Main Content -->
      <v-container class="main-content py-4">
        <v-row>
          <v-col cols="12" class="text-center pb-2">
            <h2 class="text-h5 font-weight-medium text-grey-darken-2">
              Please Select Your Name
            </h2>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <UserSelector />
          </v-col>
        </v-row>

        <v-row v-if="initialLoading">
          <v-col cols="12">
            <LoadingState :loading="true" message="Loading availability data..." />
          </v-col>
        </v-row>

        <v-row v-if="!initialLoading">
          <v-col cols="12" class="text-center pb-2 pt-6">
            <h2 class="text-h5 font-weight-medium text-grey-darken-2">
              Select All of the Dates That You Are Available
            </h2>
          </v-col>
        </v-row>

        <v-row v-if="!initialLoading">
          <v-col cols="12">
            <Calendar
              :user-dates="userDates"
              :loading="saving"
              @date-toggled="handleDateToggle"
              @month-changed="handleMonthChange"
            />
          </v-col>
        </v-row>

        <v-row v-if="!initialLoading">
          <v-col cols="12">
            <OverlapDates :overlap-dates="overlapDates" />
          </v-col>
        </v-row>

        <v-row v-if="error">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" closable @click:close="error = null">
              <strong>Error:</strong> {{ error }}
            </v-alert>
          </v-col>
        </v-row>

        <v-snackbar
          v-model="realtimeUpdateSnackbar"
          :timeout="2000"
          color="success"
          location="bottom right"
        >
          <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
          Calendar updated
        </v-snackbar>
      </v-container>
    </v-main>

    <v-footer app color="surface" class="text-center py-4">
      <v-container>
        <div class="text-caption">
          {{ config.appName }} &copy; {{ new Date().getFullYear() }}
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import UserSelector from './components/UserSelector.vue'
import Calendar from './components/Calendar.vue'
import LoadingState from './components/LoadingState.vue'
import OverlapDates from './components/OverlapDates.vue'
import { useSupabase } from './composables/useSupabase'
import { useUsers } from './composables/useUsers'
import { config } from '../config.js'

const initialLoading = ref(true)
const saving = ref(false)
const error = ref(null)
const realtimeUpdateSnackbar = ref(false)
const realtimeConnected = ref(false)

const userDates = reactive({})

const overlapDates = computed(() => {
  const counts = {}
  Object.entries(userDates).forEach(([userName, dates]) => {
    dates.forEach(d => {
      if (!counts[d]) counts[d] = new Set()
      counts[d].add(userName)
    })
  })
  const threshold = 6
  return Object.entries(counts)
    .filter(([, set]) => set.size >= threshold)
    .map(([date, set]) => {
      const mappedUsers = Array.from(set).map(uName => ({
        name: uName,
      }))
      return { date, users: mappedUsers }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
})

const { loadAllAvailability, toggleUserDate, subscribeToChanges } = useSupabase()
const { users } = useUsers()

let realtimeSubscription = null

const loadAvailability = async () => {
  try {
    const data = await loadAllAvailability()
    Object.keys(userDates).forEach(key => { delete userDates[key] })
    data.forEach(record => {
      if (!userDates[record.user_name]) userDates[record.user_name] = []
      userDates[record.user_name].push(record.selected_date)
    })
    users.forEach(user => {
      if (!userDates[user.name]) userDates[user.name] = []
    })
    error.value = null
  } catch (err) {
    error.value = `Failed to load availability: ${err.message}`
  } finally {
    initialLoading.value = false
  }
}

const handleDateToggle = async ({ userName, date, shouldAdd }) => {
  saving.value = true
  error.value = null
  try {
    const success = await toggleUserDate(userName, date, shouldAdd)
    if (success) {
      if (!userDates[userName]) userDates[userName] = []
      if (shouldAdd) {
        if (!userDates[userName].includes(date)) userDates[userName].push(date)
      } else {
        const index = userDates[userName].indexOf(date)
        if (index > -1) userDates[userName].splice(index, 1)
      }
    } else {
      error.value = 'Failed to update date. Please try again.'
    }
  } catch (err) {
    error.value = `Error updating date: ${err.message}`
  } finally {
    saving.value = false
  }
}

const handleMonthChange = ({ month, year }) => {
  console.log(`Navigated to ${month}/${year}`)
}

const handleRealtimeUpdate = () => {
  loadAvailability()
  realtimeUpdateSnackbar.value = true
}

const onLogoError = () => {
  console.warn('Logo failed to load.')
}

const setupRealtime = () => {
  if (config.features.realTimeSync) {
    try {
      realtimeSubscription = subscribeToChanges(handleRealtimeUpdate)
      realtimeConnected.value = true
    } catch (err) {
      realtimeConnected.value = false
    }
  }
}

onMounted(async () => {
  await loadAvailability()
  setupRealtime()
})

onUnmounted(() => {
  if (realtimeSubscription) {
    realtimeSubscription.unsubscribe()
    realtimeConnected.value = false
  }
})
</script>

<style>
#app { font-family: 'Roboto', sans-serif; }
.v-container { max-width: 1200px; }

.hero-section {
  background: linear-gradient(135deg, #fff5f5 0%, #ffcccc 100%);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  width: 280px;
  margin: 0 auto;
}

.hero-logo {
  height: 100%;
  width: 100%;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));
  transition: transform 0.3s ease;
}

.hero-logo:hover { transform: scale(1.05); }

.hero-title {
  font-size: 3rem;
  color: #C62828;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-subtitle { font-size: 1.2rem; font-weight: 300; }
.main-content { background: #fafafa; }

@media (max-width: 600px) {
  .logo-container { height: 180px; width: 180px; }
  .hero-title { font-size: 2.25rem; }
  .hero-subtitle { font-size: 1.1rem; }
  .hero-section { padding-top: 1rem !important; padding-bottom: 1rem !important; }
}

@media (min-width: 601px) and (max-width: 960px) {
  .logo-container { height: 220px; width: 220px; }
  .hero-title { font-size: 2.75rem; }
}

@media (min-width: 1200px) {
  .logo-container { height: 320px; width: 320px; }
  .hero-title { font-size: 3.5rem; }
}

* { transition: all 0.2s ease; }
.v-card { border-radius: 12px; }
.v-footer { border-top: 1px solid rgba(0,0,0,0.1); }
</style>
