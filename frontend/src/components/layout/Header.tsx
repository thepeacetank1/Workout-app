import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  useBreakpointValue,
  HStack,
  MenuDivider,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiMoon, FiSun, FiHelpCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get user from Redux state
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      as="header"
      bg="brand.500"
      color="white"
      px={4}
      py={2}
      boxShadow="sm"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading 
          as={RouterLink} 
          to="/app"
          size={isMobile ? "md" : "lg"}
          fontWeight="bold"
        >
          Workout App
        </Heading>

        <Flex>
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
            _hover={{ bg: 'brand.600' }}
            mr={2}
          />
          
          <Menu>
            <MenuButton>
              <HStack spacing={2}>
                {!isMobile && user && (
                  <Text fontSize="sm" fontWeight="medium">
                    {user.name}
                  </Text>
                )}
                <Avatar 
                  size="sm" 
                  name={user?.name || 'User'} 
                  src={user?.avatar} 
                  bg="white" 
                  color="brand.500" 
                />
              </HStack>
            </MenuButton>
            <MenuList color="gray.800">
              <Box px={3} py={2}>
                <Text fontWeight="bold">{user?.name || 'User'}</Text>
                <Text fontSize="sm" color="gray.500">{user?.email || ''}</Text>
              </Box>
              <MenuDivider />
              <MenuItem 
                icon={<FiUser />} 
                as={RouterLink} 
                to="/app/profile"
              >
                Profile
              </MenuItem>
              <MenuItem 
                icon={<FiSettings />}
                as={RouterLink} 
                to="/app/settings"
              >
                Settings
              </MenuItem>
              <MenuItem 
                icon={<FiHelpCircle />}
                as={RouterLink} 
                to="/app/help"
              >
                Help
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                icon={<FiLogOut />} 
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;