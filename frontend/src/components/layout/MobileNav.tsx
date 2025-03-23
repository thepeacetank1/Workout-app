import React from 'react';
import { Flex, Icon, Text, Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTarget, FiUser, FiActivity, FiMenu } from 'react-icons/fi';
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
    <Link to={to} style={{ flex: 1 }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={2}
        position="relative"
        color={isActive ? 'brand.500' : 'gray.500'}
        _hover={{ color: 'brand.500' }}
        fontWeight={isActive ? 'bold' : 'normal'}
        transition="all 0.2s"
      >
        {isActive && (
          <Box
            position="absolute"
            top="0"
            left="50%"
            transform="translateX(-50%)"
            width="18px"
            height="2px"
            bg="brand.500"
            borderRadius="full"
          />
        )}
        {React.cloneElement(icon, {
          fontSize: "20px",
          mb: 1
        })}
        <Text fontSize="xs">{children}</Text>
      </Flex>
    </Link>
  );
};

const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isActivePartial = (path: string) => location.pathname.startsWith(path);
  
  return (
    <Flex
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="0 -1px 3px rgba(0,0,0,0.1)"
      zIndex={10}
      display={{ base: 'flex', lg: 'none' }}
    >
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
        isActive={isActivePartial('/app/workout')}
      >
        Workout
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
        isActive={isActivePartial('/app/diet')}
      >
        Diet
      </NavItem>
      
      <NavItem 
        icon={<Icon as={FiMenu} />} 
        to="/app/more" 
        isActive={
          isActivePartial('/app/goals') || 
          isActivePartial('/app/profile') || 
          isActivePartial('/app/calendar') || 
          isActivePartial('/app/progress') ||
          isActive('/app/more')
        }
      >
        More
      </NavItem>
    </Flex>
  );
};

export default MobileNav;