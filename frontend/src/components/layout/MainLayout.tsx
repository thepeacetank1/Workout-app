import React from 'react';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Breadcrumb from '../common/Breadcrumb';

const MainLayout: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />
      <Flex flex="1" overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box
          flex="1"
          p={4}
          overflow="auto"
          bg="gray.50"
        >
          <Breadcrumb />
          <Outlet />
        </Box>
      </Flex>
      {isMobile && <MobileNav />}
    </Flex>
  );
};

export default MainLayout;