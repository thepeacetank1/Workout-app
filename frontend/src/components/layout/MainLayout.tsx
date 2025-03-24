import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

// Create a Sidebar component within MainLayout or import it if you have it as a separate file
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Workouts', path: '/workouts' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Progress', path: '/progress' },
    { name: 'Profile', path: '/profile' }
  ];
  
  return (
    <Box bg="blue.500" color="white" w="200px" h="100vh" py={4}>
      <Box fontSize="xl" fontWeight="bold" px={4} mb={6}>Workout App</Box>
      <Flex direction="column" align="stretch" gap={1}>
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} style={{ textDecoration: 'none' }}>
            <Box
              py={2}
              px={4}
              bg={location.pathname.startsWith(item.path) ? 'blue.600' : 'transparent'}
              _hover={{ bg: 'blue.600' }}
              cursor="pointer"
            >
              {item.name}
            </Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

// Header component
const Header = () => {
  return (
    <Flex px={4} py={3} bg="white" alignItems="center" borderBottomWidth="1px" borderColor="gray.200">
      <Box flex="1">
        Search Bar
      </Box>
      <Box>
        User Menu
      </Box>
    </Flex>
  );
};

// MainLayout component
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" overflowY="auto">
        <Header />
        <Box p={4}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;