'use client';
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';

interface LinksProps {
  routes: IRoute[];
  onClose?: () => void;
}

export default function Links({ routes, onClose }: LinksProps) {
  const textColor = useColorModeValue('navy.700', 'white');
  const activeBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  console.log('Routes in Links:', routes); // Debug

  return (
    <Box>
      {routes.map((route, index) => {
        if (route.invisible || route.disabled) return null;
        return (
          <NavLink key={index} href={route.path} onClick={onClose}>
            <Flex
              align="center"
              p="10px"
              borderRadius="md"
              _hover={{ bg: activeBg }}
              bg={route.path === window.location.pathname ? activeBg : 'transparent'}
              cursor="pointer"
              pointerEvents="auto" // Ensure clickable
            >
              {route.icon && (
                <Icon
                  as={route.icon.type}
                  w="20px"
                  h="20px"
                  color={textColor} // Use active color
                  mr="10px"
                />
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
