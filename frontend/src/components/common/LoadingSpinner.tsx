import React from 'react';
import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullPage?: boolean;
  thickness?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'xl',
  message = 'Loading...',
  fullPage = false,
  thickness = '4px',
  color = 'brand.500',
}) => {
  if (fullPage) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
        position="fixed"
        top={0}
        left={0}
        backgroundColor="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
      >
        <VStack spacing={4}>
          <Spinner
            thickness={thickness}
            speed="0.65s"
            emptyColor="gray.200"
            color={color}
            size={size}
          />
          {message && (
            <Text fontWeight="medium" color="gray.600">
              {message}
            </Text>
          )}
        </VStack>
      </Flex>
    );
  }

  return (
    <VStack spacing={4} my={8}>
      <Spinner
        thickness={thickness}
        speed="0.65s"
        emptyColor="gray.200"
        color={color}
        size={size}
      />
      {message && (
        <Text fontWeight="medium" color="gray.600">
          {message}
        </Text>
      )}
    </VStack>
  );
};

export default LoadingSpinner;

export const InlineSpinner: React.FC<{ size?: string; color?: string }> = ({
  size = '1em',
  color = 'currentColor',
}) => (
  <Spinner
    size="sm"
    thickness="2px"
    speed="0.65s"
    emptyColor="transparent"
    color={color}
    h={size}
    w={size}
    verticalAlign="middle"
    ml={1}
  />
);