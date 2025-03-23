import React from 'react';
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
}

// Map route paths to human-readable labels
const routeLabels: Record<string, string> = {
  '': 'Home',
  'app': 'Dashboard',
  'dashboard': 'Dashboard',
  'workouts': 'Workouts',
  'workout': 'Workout',
  'nutrition': 'Nutrition',
  'meals': 'Meal Plans',
  'recipes': 'Recipes',
  'profile': 'Profile',
  'settings': 'Settings',
  'goals': 'Goals',
  'progress': 'Progress',
  'calendar': 'Calendar',
  'exercises': 'Exercises',
  'diet': 'Diet Plans',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRightIcon color="gray.500" />,
  showHome = true,
  maxItems = 4,
}) => {
  const location = useLocation();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const activeColor = useColorModeValue('brand.600', 'brand.400');
  
  // Generate breadcrumb items based on current location if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname, showHome);
  
  // Truncate breadcrumb items if they exceed the max limit
  const displayItems = truncateBreadcrumbItems(breadcrumbItems, maxItems);
  
  if (displayItems.length <= 1) {
    return null; // Don't show breadcrumbs if there's only one item
  }
  
  return (
    <Flex py={2} px={1} alignItems="center" fontSize="sm" color={textColor} mb={4}>
      <ChakraBreadcrumb separator={separator} spacing="8px">
        {displayItems.map((item, index) => (
          <BreadcrumbItem 
            key={item.path} 
            isCurrentPage={item.isCurrentPage || index === displayItems.length - 1}
          >
            <BreadcrumbLink
              as={index === displayItems.length - 1 ? undefined : Link}
              to={item.path}
              color={index === displayItems.length - 1 ? activeColor : undefined}
              fontWeight={index === displayItems.length - 1 ? 'semibold' : 'normal'}
              _hover={{
                textDecoration: index === displayItems.length - 1 ? 'none' : 'underline',
                color: index === displayItems.length - 1 ? activeColor : 'brand.500',
              }}
            >
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </ChakraBreadcrumb>
    </Flex>
  );
};

// Helper function to generate breadcrumb items from URL path
const generateBreadcrumbItems = (path: string, showHome: boolean): BreadcrumbItem[] => {
  const pathSegments = path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  
  // Always add home if requested
  if (showHome) {
    items.push({ label: 'Home', path: '/' });
  }
  
  // Build up nested paths
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Check if the segment is a MongoDB ID (24 character hex)
    if (segment.match(/^[0-9a-fA-F]{24}$/)) {
      // It's likely an ID, use previous segment as a type
      const entityType = pathSegments[index - 1] ? pathSegments[index - 1] : 'Item';
      // Remove trailing 's' if it exists (e.g. workouts -> workout)
      const singularType = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;
      
      items.push({
        label: `${capitalizeFirstLetter(singularType)} Details`,
        path: currentPath,
      });
    } else {
      // Get a human-readable label
      let label = routeLabels[segment] || segment;
      
      // If not in our mapping, convert kebab-case or camelCase to Title Case
      if (!routeLabels[segment]) {
        label = segment
          // Insert space before capital letters
          .replace(/([A-Z])/g, ' $1')
          // Replace hyphens and underscores with spaces
          .replace(/[-_]/g, ' ')
          // Capitalize first letter of each word
          .replace(/\w\S*/g, (txt) => capitalizeFirstLetter(txt))
          .trim();
      }
      
      items.push({
        label,
        path: currentPath,
      });
    }
  });
  
  // Mark the last item as current page
  if (items.length > 0) {
    items[items.length - 1].isCurrentPage = true;
  }
  
  return items;
};

// Helper function to truncate breadcrumb items when there are too many
const truncateBreadcrumbItems = (items: BreadcrumbItem[], maxItems: number): BreadcrumbItem[] => {
  if (items.length <= maxItems) {
    return items;
  }
  
  // Always keep the first (home) and last (current page) items
  const first = items[0];
  const last = items[items.length - 1];
  
  if (maxItems === 2) {
    return [first, last];
  }
  
  // For 3 or more max items, keep some middle items
  const middleCount = maxItems - 2;
  const middleStart = Math.max(1, items.length - middleCount - 1);
  const middleItems = items.slice(middleStart, middleStart + middleCount);
  
  // If we can't show all items, add an ellipsis item
  if (middleStart > 1) {
    return [first, { label: '...', path: '#' }, ...middleItems, last];
  }
  
  return [first, ...middleItems, last];
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Breadcrumb;