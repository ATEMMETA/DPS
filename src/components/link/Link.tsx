'use client';
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';

interface LinksProps {
  routes: IRoute[];
}

export default function Links({ routes }: LinksProps) {
  const textColor = useColorModeValue('navy.700', 'white');
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box>
      {routes.map((route, index) => {
        if (route.invisible || route.disabled) return null; // Skip invisible/disabled
        return (
          <NavLink key={index} href={route.path}>
            <Flex align="center" p="10px" borderRadius="md" _hover={{ bg: 'gray.100' }}>
              {route.icon && (
                <Icon as={route.icon.type} w="20px" h="20px" color={inactiveColor} mr="10px" />
              )}
              <Text color={textColor} fontSize="sm" fontWeight="500">
                {route.name}
              </Text>
            </Flex>
          </NavLink>
        );
      })}
    </Box>
  );
}
