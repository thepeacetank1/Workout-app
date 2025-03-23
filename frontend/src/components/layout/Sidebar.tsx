import React from 'react';
import { Box, VStack, Icon, Text, Flex, Divider } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiActivity, 
  FiCalendar, 
  FiTarget, 
  FiTrendingUp,
  FiUser,
  FiHelpCircle,
  FiClipboard
} from 'react-icons/fi';
import { GiMuscleUp } from 'react-icons/gi';
import { MdFastfood, MdRestaurantMenu } from 'react-icons/md';

interface NavItemProps {
  icon: React.ReactElement;
  children: string;
  to: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, to, isActive }) => {
  return (
    <Link to={to} style={{ width: '100%' }}>
      <Flex
        align="center"
        p="3"
        mx="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: isActive ? 'brand.600' : 'gray.100',
          color: isActive ? 'white' : 'gray.800',
        }}
        fontWeight={isActive ? 'bold' : 'normal'}
        transition="all 0.2s"
      >
        {React.cloneElement(icon, {
          mr: 3,
          fontSize: "16px",
        })}
        <Text fontSize="sm">{children}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isActivePartial = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      as="nav"
      h="full"
      w="64"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={5}
      display={{ base: 'none', lg: 'block' }}
    >
      <VStack spacing={1} align="stretch">
        <NavItem 
          icon={<Icon as={FiHome} />} 
          to="/app" 
          isActive={isActive('/app')}
        >
          Dashboard
        </NavItem>
        
        <NavItem 
          icon={<Icon as={FiActivity} />} 
          to="/app/workout" 
          isActive={isActive('/app/workout')}
        >
          Workout
        </NavItem>
        
        <NavItem 
          icon={<Icon as={GiMuscleUp} />} 
          to="/app/workouts" 
          isActive={isActivePartial('/app/workouts')}
        >
          Workout Programs
        </NavItem>
        
        <NavItem 
          icon={<Icon as={MdFastfood} />} 
          to="/app/nutrition" 
          isActive={isActivePartial('/app/nutrition')}
        >
          Nutrition
        </NavItem>
        
        <NavItem 
          icon={<Icon as={MdRestaurantMenu} />} 
          to="/app/diet" 
          isActive={isActive('/app/diet')}
        >
          Diet Plan
        </NavItem>
        
        <NavItem 
          icon={<Icon as={FiTarget} />} 
          to="/app/goals" 
          isActive={isActive('/app/goals')}
        >
          Goals
        </NavItem>
        
        <NavItem 
          icon={<Icon as={FiCalendar} />} 
          to="/app/calendar" 
          isActive={isActive('/app/calendar')}
        >
          Calendar
        </NavItem>
        
        <NavItem 
          icon={<Icon as={FiTrendingUp} />} 
          to="/app/progress" 
          isActive={isActive('/app/progress')}
        >
          Progress
        </NavItem>
        
        <Divider my={3} />
        
        <NavItem 
          icon={<Icon as={FiUser} />} 
          to="/app/profile" 
          isActive={isActive('/app/profile')}
        >
          Profile
        </NavItem>
        
        <NavItem 
          icon={<Icon as={FiHelpCircle} />} 
          to="/app/help" 
          isActive={isActive('/app/help')}
        >
          Help
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;