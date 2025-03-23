import React from 'react';
import { Breadcrumb as ChakraBreadcrumb, BreadcrumbItem, BreadcrumbLink, Flex } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  items?: { label: string; path: string }[];
  showHome?: boolean;
}

// Map of route paths to human-readable names
const routeNames: Record<string, string> = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'workout': 'Workouts',
  'nutrition': 'Nutrition',
  'profile': 'Profile',
  'diet': 'Diet Plans',
  'goals': 'Goals',
  'settings': 'Settings',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHome = true }) => {
  const location = useLocation();
  
  // If no items provided, generate from current path
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname, showHome);
  
  return (
    <Flex mb={4} mt={2} fontSize="sm" color="gray.500">
      <ChakraBreadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbItems.length - 1}>
            <BreadcrumbLink 
              as={index < breadcrumbItems.length - 1 ? Link : undefined} 
              to={item.path}
              fontWeight={index === breadcrumbItems.length - 1 ? "semibold" : "normal"}
              color={index === breadcrumbItems.length - 1 ? "blue.500" : undefined}
            >
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </ChakraBreadcrumb>
    </Flex>
  );
};

// Helper function to generate breadcrumb items from path
const generateBreadcrumbItems = (path: string, showHome: boolean): { label: string; path: string }[] => {
  const pathSegments = path.split('/').filter(segment => segment);
  const items: { label: string; path: string }[] = [];
  
  // Add home if requested
  if (showHome) {
    items.push({ label: 'Home', path: '/' });
  }
  
  // Build up the paths and add each segment
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Handle dynamic paths with IDs
    if (segment.match(/^[0-9a-fA-F]{24}$/)) {
      // This is likely a MongoDB ID, use previous segment as a descriptor
      const entityType = pathSegments[index - 1];
      items.push({ 
        label: `${entityType?.charAt(0).toUpperCase()}${entityType?.slice(1)} Details`, 
        path: currentPath 
      });
    } else {
      // Convert dashCase or camelCase to Title Case
      const label = routeNames[segment] || segment.replace(/[-_]/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      
      items.push({ label, path: currentPath });
    }
  });
  
  return items;
};

export default Breadcrumb;