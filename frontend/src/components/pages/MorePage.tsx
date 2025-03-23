import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiInfo,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface MenuItemProps {
  icon: React.ReactElement;
  title: string;
  description?: string;
  to?: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  description,
  to,
  onClick,
}) => {
  const Component = to ? RouterLink : Box;
  const props = to ? { to, as: RouterLink } : { onClick };

  return (
    <Component {...props} style={{ width: '100%' }}>
      <Flex
        p={4}
        alignItems="center"
        borderRadius="md"
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Flex
          w={10}
          h={10}
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          bg={useColorModeValue('brand.100', 'brand.800')}
          color={useColorModeValue('brand.600', 'brand.200')}
          mr={4}
        >
          {React.cloneElement(icon, { size: 20 })}
        </Flex>
        <Box>
          <Text fontWeight="medium">{title}</Text>
          {description && (
            <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
              {description}
            </Text>
          )}
        </Box>
      </Flex>
    </Component>
  );
};

const MorePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <Heading size="lg" mb={6}>
        More Options
      </Heading>

      <VStack spacing={4} align="stretch">
        {user && (
          <Flex
            p={4}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
            alignItems="center"
          >
            <Avatar size="md" name={user.name} src={user.avatar} mr={4} />
            <Box>
              <Text fontWeight="bold">{user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {user.email}
              </Text>
            </Box>
          </Flex>
        )}

        <Box bg={bgColor} borderRadius="md" boxShadow="sm" overflow="hidden">
          <MenuItem
            icon={<Icon as={FiUser} />}
            title="Profile"
            description="Manage your personal information"
            to="/app/profile"
          />
          <Divider />
          <MenuItem
            icon={<Icon as={FiTarget} />}
            title="Goals"
            description="Set and track your fitness goals"
            to="/app/goals"
          />
          <Divider />
          <MenuItem
            icon={<Icon as={FiCalendar} />}
            title="Calendar"
            description="Schedule and view your workouts"
            to="/app/calendar"
          />
          <Divider />
          <MenuItem
            icon={<Icon as={FiTrendingUp} />}
            title="Progress"
            description="Track your fitness journey"
            to="/app/progress"
          />
        </Box>

        <Box bg={bgColor} borderRadius="md" boxShadow="sm" overflow="hidden">
          <MenuItem
            icon={<Icon as={FiSettings} />}
            title="Settings"
            description="App preferences and notifications"
            to="/app/settings"
          />
          <Divider />
          <MenuItem
            icon={<Icon as={FiHelpCircle} />}
            title="Help & Support"
            description="Get assistance and FAQ"
            to="/app/help"
          />
          <Divider />
          <MenuItem
            icon={<Icon as={FiInfo} />}
            title="About"
            description="App version and information"
            to="/app/about"
          />
        </Box>

        <Button
          leftIcon={<FiLogOut />}
          colorScheme="red"
          variant="outline"
          onClick={handleLogout}
          width="full"
          size="lg"
        >
          Log Out
        </Button>
      </VStack>
    </Box>
  );
};

export default MorePage;