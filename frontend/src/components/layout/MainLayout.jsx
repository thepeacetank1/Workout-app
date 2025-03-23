import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';

// Mock components - replace with real implementations
const Sidebar = () => (
  <Box 
    width="250px" 
    height="100vh" 
    bg="brand.700" 
    color="white" 
    p={4} 
    position="fixed"
    left={0}
    top={0}
  >
    <Box fontWeight="bold" fontSize="xl" mb={6}>Workout App</Box>
    <Box py={2}>Dashboard</Box>
    <Box py={2}>Workouts</Box>
    <Box py={2}>Nutrition</Box>
    <Box py={2}>Progress</Box>
    <Box py={2}>Profile</Box>
  </Box>
);

const Header = () => (
  <Box 
    height="60px" 
    bg="white" 
    boxShadow="sm" 
    position="fixed" 
    width="calc(100% - 250px)" 
    right={0} 
    top={0} 
    zIndex={10}
    px={6}
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    <Box>Search Bar</Box>
    <Box>User Menu</Box>
  </Box>
);

const MainLayout = () => {
  return (
    <Flex>
      <Sidebar />
      <Box ml="250px" flex={1}>
        <Header />
        <Box as="main" p={6} mt="60px">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;