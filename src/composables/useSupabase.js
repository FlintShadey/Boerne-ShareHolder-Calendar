import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl.includes('placeholder') || 
  supabaseAnonKey.includes('placeholder')

if (isPlaceholder) {
  console.warn('Using placeholder Supabase credentials. Database operations will be simulated.')
}

export const supabase = isPlaceholder ? null : createClient(supabaseUrl, supabaseAnonKey)

// Composable for Supabase operations
export function useSupabase() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Load all user availability from database
   * @returns {Promise<Array>} Array of availability records
   */
  const loadAllAvailability = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Return empty data if using placeholder credentials
      if (!supabase) {
        console.log('Demo mode: No database connection available')
        return []
      }

      const { data, error: dbError } = await supabase
        .from('user_availability')
        .select('*')
        .order('selected_date', { ascending: true })
      
      if (dbError) throw dbError
      
      return data || []
    } catch (err) {
      error.value = err.message
      console.error('Error loading availability:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get dates for a specific user
   * @param {string} userName - The user's name
   * @returns {Promise<Array>} Array of date strings (YYYY-MM-DD)
   */
  const getUserDates = async (userName) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: dbError } = await supabase
        .from('user_availability')
        .select('selected_date')
        .eq('user_name', userName)
        .order('selected_date', { ascending: true })
      
      if (dbError) throw dbError
      
      return data?.map(record => record.selected_date) || []
    } catch (err) {
      error.value = err.message
      console.error('Error loading user dates:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a date for a user
   * @param {string} userName - The user's name
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {Promise<boolean>} Success status
   */
  const addUserDate = async (userName, date) => {
    loading.value = true
    error.value = null
    
    try {
      // Return success if using placeholder credentials
      if (!supabase) {
        console.log('Demo mode: Simulating add date operation')
        return true
      }

      const { error: dbError } = await supabase
        .from('user_availability')
        .insert([
          {
            user_name: userName,
            selected_date: date,
            updated_at: new Date().toISOString()
          }
        ])
      
      if (dbError) {
        // Ignore unique constraint violations (date already exists)
        if (dbError.code !== '23505') {
          throw dbError
        }
      }
      
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error adding date:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove a date for a user
   * @param {string} userName - The user's name
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {Promise<boolean>} Success status
   */
  const removeUserDate = async (userName, date) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: dbError } = await supabase
        .from('user_availability')
        .delete()
        .eq('user_name', userName)
        .eq('selected_date', date)
      
      if (dbError) throw dbError
      
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error removing date:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle a date for a user (add if doesn't exist, remove if exists)
   * @param {string} userName - The user's name
   * @param {string} date - Date string (YYYY-MM-DD)
   * @param {boolean} shouldAdd - Whether to add (true) or remove (false)
   * @returns {Promise<boolean>} Success status
   */
  const toggleUserDate = async (userName, date, shouldAdd) => {
    if (shouldAdd) {
      return await addUserDate(userName, date)
    } else {
      return await removeUserDate(userName, date)
    }
  }

  /**
   * Sync all dates for a user (bulk update)
   * @param {string} userName - The user's name
   * @param {Array<string>} dates - Array of date strings (YYYY-MM-DD)
   * @returns {Promise<boolean>} Success status
   */
  const syncUserDates = async (userName, dates) => {
    loading.value = true
    error.value = null
    
    try {
      // First, delete all existing dates for this user
      const { error: deleteError } = await supabase
        .from('user_availability')
        .delete()
        .eq('user_name', userName)
      
      if (deleteError) throw deleteError
      
      // Then, insert all new dates
      if (dates.length > 0) {
        const records = dates.map(date => ({
          user_name: userName,
          selected_date: date,
          updated_at: new Date().toISOString()
        }))
        
        const { error: insertError } = await supabase
          .from('user_availability')
          .insert(records)
        
        if (insertError) throw insertError
      }
      
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error syncing user dates:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Subscribe to real-time changes
   * @param {Function} callback - Callback function to handle changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  const subscribeToChanges = (callback) => {
    const channel = supabase
      .channel('user_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_availability'
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel)
      }
    }
  }

  return {
    loading,
    error,
    loadAllAvailability,
    getUserDates,
    addUserDate,
    removeUserDate,
    toggleUserDate,
    syncUserDates,
    subscribeToChanges
  }
}
