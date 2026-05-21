import { ref, computed } from 'vue'
import { users as configUsers } from '../../config.js'

// Active user state (shared across components)
const activeUserIndex = ref(0)

export function useUsers() {
  // Get users from config
  const users = configUsers

  // Computed property for active user
  const activeUser = computed(() => users[activeUserIndex.value])

  /**
   * Set the active user by index
   * @param {number} index - User index
   */
  const setActiveUser = (index) => {
    if (index >= 0 && index < users.length) {
      activeUserIndex.value = index
    }
  }

  /**
   * Set the active user by name
   * @param {string} name - User name
   */
  const setActiveUserByName = (name) => {
    const index = users.findIndex(user => user.name === name)
    if (index !== -1) {
      activeUserIndex.value = index
    }
  }

  /**
   * Get user by name
   * @param {string} name - User name
   * @returns {Object|null} User object or null
   */
  const getUserByName = (name) => {
    return users.find(user => user.name === name) || null
  }

  /**
   * Get user color by name
   * @param {string} name - User name
   * @returns {string} Color hex code
   */
  const getUserColor = (name) => {
    const user = getUserByName(name)
    return user ? user.color : '#9E9E9E'
  }

  /**
   * Check if a user is active
   * @param {number} index - User index
   * @returns {boolean} True if user is active
   */
  const isActiveUser = (index) => {
    return activeUserIndex.value === index
  }

  return {
    users,
    activeUser,
    activeUserIndex,
    setActiveUser,
    setActiveUserByName,
    getUserByName,
    getUserColor,
    isActiveUser
  }
}
