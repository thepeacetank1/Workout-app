import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

// Custom theme
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4',
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
  },
  accent: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
        },
      },
    },
  },
});

// Create a simpler version of the app first to avoid missing component errors
function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<div>Dashboard</div>} />
              <Route path="profile" element={<div>Profile</div>} />
              <Route path="goals" element={<div>Goals</div>} />
              <Route path="workouts" element={<div>Workouts</div>} />
              <Route path="workouts/:id" element={<div>Workout Details</div>} />
              <Route path="nutrition" element={<div>Nutrition</div>} />
              <Route path="nutrition/meal-plans/:id" element={<div>Meal Plan</div>} />
              <Route path="calendar" element={<div>Calendar</div>} />
              <Route path="progress" element={<div>Progress</div>} />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;