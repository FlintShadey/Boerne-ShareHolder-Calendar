// Boerne ShareHolder Calendar Configuration File

export const config = {
  appName: 'Boerne ShareHolder Availability Calendar',
  appShortName: 'Boerne ShareHolder Calendar',
  logoPath: '/boerne-logo.png',

  users: [
    { name: 'Laura Costas',   color: '#E53935', displayColor: '#C62828', textColor: '#FFFFFF' },
    { name: 'David Le',       color: '#8E24AA', displayColor: '#6A1B9A', textColor: '#FFFFFF' },
    { name: 'Josh Pascoe',    color: '#1E88E5', displayColor: '#1565C0', textColor: '#FFFFFF' },
    { name: 'Kate Harrison',  color: '#00ACC1', displayColor: '#00838F', textColor: '#FFFFFF' },
    { name: 'Joseph Aldrich', color: '#43A047', displayColor: '#2E7D32', textColor: '#FFFFFF' },
    { name: 'Reed Flora',     color: '#F4511E', displayColor: '#BF360C', textColor: '#FFFFFF' },
    { name: 'Jared Dupree',   color: '#FFB300', displayColor: '#FF6F00', textColor: '#FFFFFF' },
    { name: 'Flint Smith',    color: '#6D4C41', displayColor: '#4E342E', textColor: '#FFFFFF' },
    { name: 'Mike Lowry',     color: '#546E7A', displayColor: '#37474F', textColor: '#FFFFFF' },
    { name: 'Yanni Berios',   color: '#D81B60', displayColor: '#880E4F', textColor: '#FFFFFF' },
    { name: 'Zack Baum',      color: '#00897B', displayColor: '#00695C', textColor: '#FFFFFF' },
  ],

  dateRange: {
    getStartDate() {
      return new Date(2026, 5, 1); // June 1, 2026
    },
    getEndDate() {
      return new Date(2026, 8, 30); // September 30, 2026
    },
    getDisplayRange() {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const start = this.getStartDate();
      const end = this.getEndDate();
      return `${months[start.getMonth()]} ${start.getFullYear()} - ${months[end.getMonth()]} ${end.getFullYear()}`;
    },
  },

  ui: {
    theme: 'light',
    enableMobileOptimizations: true,
    showLoadingIndicators: true,
    animateTransitions: true,
  },

  features: {
    realTimeSync: true,
    multiUserSelection: true,
    dateToggle: true,
    monthNavigation: true,
  },
};

export const { users, dateRange, ui, features } = config;
export default config;
