import React from 'react';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Box,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';

interface SkeletonLoaderProps {
  type:
    | 'card'
    | 'list'
    | 'table'
    | 'form'
    | 'profile'
    | 'dashboard'
    | 'workout'
    | 'detail';
  count?: number;
  spacing?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type,
  count = 1,
  spacing = 4,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <Box p={5} boxShadow="md" borderRadius="md" width="100%">
            <Skeleton height="150px" mb={4} />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        );

      case 'list':
        return (
          <Box py={2} width="100%">
            <Flex align="center">
              <SkeletonCircle size="10" mr={4} />
              <SkeletonText flex="1" noOfLines={2} spacing="4" />
            </Flex>
          </Box>
        );

      case 'table':
        return (
          <Box width="100%">
            <Skeleton height="40px" mb={4} width="100%" />
            <Stack spacing={2} width="100%">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} height="40px" width="100%" />
                ))}
            </Stack>
          </Box>
        );

      case 'form':
        return (
          <Box width="100%">
            <Stack spacing={3}>
              <Skeleton height="20px" width="100px" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="20px" width="150px" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="20px" width="120px" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100px" mt={4} />
            </Stack>
          </Box>
        );

      case 'profile':
        return (
          <Box p={5} width="100%">
            <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={6}>
              <SkeletonCircle size="20" mr={{ base: 0, md: 8 }} mb={{ base: 4, md: 0 }} />
              <Box flex="1">
                <Skeleton height="30px" width="200px" mb={2} />
                <Skeleton height="20px" width="150px" />
              </Box>
            </Flex>
            <SkeletonText mt={4} noOfLines={6} spacing="4" />
          </Box>
        );

      case 'dashboard':
        return (
          <Box width="100%">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
              <Skeleton height="100px" borderRadius="md" />
              <Skeleton height="100px" borderRadius="md" />
              <Skeleton height="100px" borderRadius="md" />
            </SimpleGrid>
            <Skeleton height="200px" mb={8} borderRadius="md" />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              <Skeleton height="250px" borderRadius="md" />
              <Skeleton height="250px" borderRadius="md" />
            </SimpleGrid>
          </Box>
        );

      case 'workout':
        return (
          <Box p={4} boxShadow="md" borderRadius="md" width="100%">
            <Flex justify="space-between" mb={4}>
              <Skeleton height="30px" width="200px" />
              <Skeleton height="30px" width="100px" />
            </Flex>
            <Stack spacing={3}>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Flex key={i} align="center" justify="space-between">
                    <Box flex="1">
                      <Skeleton height="20px" width="80%" mb={2} />
                      <Skeleton height="15px" width="50%" />
                    </Box>
                    <Skeleton height="30px" width="60px" />
                  </Flex>
                ))}
            </Stack>
          </Box>
        );

      case 'detail':
        return (
          <Box width="100%">
            <Skeleton height="40px" width="60%" mb={6} />
            <Skeleton height="20px" width="100%" mb={2} />
            <Skeleton height="20px" width="90%" mb={2} />
            <Skeleton height="20px" width="95%" mb={6} />
            <Skeleton height="150px" mb={6} />
            <Stack spacing={4}>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Box key={i}>
                    <Skeleton height="24px" width="40%" mb={2} />
                    <Skeleton height="20px" width="100%" mb={1} />
                    <Skeleton height="20px" width="90%" />
                  </Box>
                ))}
            </Stack>
          </Box>
        );

      default:
        return <Skeleton height="100px" />;
    }
  };

  return (
    <Stack spacing={spacing} width="100%">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
        ))}
    </Stack>
  );
};

export default SkeletonLoader;