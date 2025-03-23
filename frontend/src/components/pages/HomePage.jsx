import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Image, 
  SimpleGrid, 
  Stack, 
  Text 
} from '@chakra-ui/react';

const Feature = ({ title, text, icon }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="brand.500"
        mb={4}
      >
        {icon}
      </Flex>
      <Heading fontSize="xl" mb={2}>{title}</Heading>
      <Text>{text}</Text>
    </Box>
  );
};

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="brand.700" color="white" py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={1} pr={{ md: 10 }} mb={{ base: 10, md: 0 }}>
              <Heading as="h1" size="2xl" mb={4}>
                Track Your Fitness Journey
              </Heading>
              <Text fontSize="xl" mb={6}>
                Our comprehensive fitness app helps you track workouts, monitor nutrition, and achieve your fitness goals.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button 
                  as={Link} 
                  to="/register" 
                  colorScheme="yellow" 
                  size="lg"
                >
                  Get Started
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  colorScheme="whiteAlpha" 
                  size="lg"
                >
                  Login
                </Button>
              </Stack>
            </Box>
            <Box flex={1}>
              {/* Placeholder for hero image */}
              <Box 
                bg="gray.300" 
                h="350px" 
                w="100%" 
                borderRadius="lg" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                Hero Image Placeholder
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={10} textAlign="center">
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <Feature
              title="Workout Tracking"
              text="Log your workouts, track progress, and see improvements over time."
              icon="🏋️"
            />
            <Feature
              title="Nutrition Tracking"
              text="Track your meals, count calories, and maintain a balanced diet."
              icon="🥗"
            />
            <Feature
              title="Progress Analytics"
              text="Visualize your progress with detailed charts and statistics."
              icon="📊"
            />
            <Feature
              title="Community Support"
              text="Connect with others, share achievements, and stay motivated."
              icon="👥"
            />
            <Feature
              title="Custom Workouts"
              text="Create personalized workout routines tailored to your goals."
              icon="✨"
            />
            <Feature
              title="Goal Setting"
              text="Set fitness goals and track your journey to achieving them."
              icon="🎯"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="gray.100" py={20}>
        <Container maxW="container.xl" textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to transform your fitness journey?
          </Heading>
          <Text fontSize="xl" mb={8} maxW="2xl" mx="auto">
            Join thousands of users who have improved their fitness with our app.
            Start your journey today.
          </Text>
          <Button 
            as={Link} 
            to="/register" 
            colorScheme="brand" 
            size="lg" 
            px={8}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;