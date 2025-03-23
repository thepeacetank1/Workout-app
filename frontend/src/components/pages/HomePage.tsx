import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Image, 
  Stack,
  Container,
  SimpleGrid,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiActivity, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { GiMuscleUp } from 'react-icons/gi';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg="brand.500" 
        color="white" 
        py={20}
        px={8}
      >
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            justify="space-between"
          >
            <Box flex={1} pr={{ base: 0, md: 8 }} mb={{ base: 10, md: 0 }}>
              <Heading 
                as="h1" 
                size="2xl" 
                mb={4}
                fontWeight="bold"
              >
                Track Your Fitness Journey
              </Heading>
              <Text fontSize="xl" mb={6}>
                The ultimate workout and nutrition tracking app to help you reach your fitness goals.
              </Text>
              <Stack direction="row" spacing={4}>
                <Button 
                  as={Link}
                  to="/register" 
                  bg="white" 
                  color="brand.500" 
                  size="lg"
                  _hover={{ bg: 'gray.100' }}
                >
                  Get Started
                </Button>
                <Button 
                  as={Link}
                  to="/login" 
                  variant="outline" 
                  colorScheme="white" 
                  size="lg"
                >
                  Login
                </Button>
              </Stack>
            </Box>
            <Box flex={1}>
              <Image 
                src="https://source.unsplash.com/random/600x400/?fitness" 
                alt="Fitness" 
                borderRadius="xl"
                shadow="2xl" 
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} px={8}>
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={16}>Key Features</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={<Icon as={GiMuscleUp} w={10} h={10} />}
              title="Workout Tracking"
              text="Track your workouts with detailed exercise logs, sets, reps, and weights."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              title="Nutrition Tracking"
              text="Log your meals and track your nutritional intake with an extensive food database."
            />
            <Feature
              icon={<Icon as={FiTarget} w={10} h={10} />}
              title="Goal Setting"
              text="Set and track your fitness goals with progress indicators and reminders."
            />
            <Feature
              icon={<Icon as={FiTrendingUp} w={10} h={10} />}
              title="Progress Tracking"
              text="Visualize your progress with charts and metrics to stay motivated."
            />
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box bg="gray.50" py={10} px={8}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
          >
            <Text>© 2025 Workout App. All rights reserved.</Text>
            <Stack direction="row" spacing={6}>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Contact</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;