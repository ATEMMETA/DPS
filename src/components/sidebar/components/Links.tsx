'use client';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarLinksProps {
  routes: IRoute[];
  onClose?: () => void; // Added for mobile
}

export function SidebarLinks({ routes, onClose }: SidebarLinksProps) {
  const pathname = usePathname();
  const activeColor = useColorModeValue('navy.700', 'white');
  const inactiveColor = useColorModeValue('gray.500', 'gray.500');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const activeIcon = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.500');

  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.collapse && !route.invisible) {
        return (
          <Accordion defaultIndex={0} allowToggle key={key}>
            <Flex w="100%" justifyContent="space-between">
              <AccordionItem border="none" mb="14px">
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  mb="4px"
                  justifyContent="center"
                  _hover={{ bg: 'unset' }}
                  _focus={{ boxShadow: 'none' }}
                  borderRadius="8px"
                  w="100%"
                  py="0px"
                  ms={0}
                >
                  {route.icon ? (
                    <Flex align="center" justifyContent="space-between" w="100%">
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                      >
                        <Flex
                          w="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box
                            color={
                              route.disabled
                                ? gray
                                : activeRoute(route.path.toLowerCase())
                                ? activeIcon
                                : inactiveColor
                            }
                            me="12px"
                            mt="6px"
                          >
                            {route.icon}
                          </Box>
                          <Text
                            me="auto"
                            color={
                              route.disabled
                                ? gray
                                : activeRoute(route.path.toLowerCase())
                                ? activeColor
                                : inactiveColor
                            }
                            fontWeight="500"
                            letterSpacing="0px"
                            fontSize="sm"
                          >
                            {route.name}
                          </Text>
                        </Flex>
                      </HStack>
                    </Flex>
                  ) : (
                    <Flex pt="0px" pb="10px" alignItems="center" w="100%">
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                        ps="32px"
                      >
                        <Text
                          me="auto"
                          fontWeight="500"
                          letterSpacing="0px"
                          fontSize="sm"
                          color={
                            route.disabled
                              ? gray
                              : activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : inactiveColor
                            }
                        >
                          {route.name}
                        </Text>
                      </HStack>
                      <AccordionIcon
                        ms="auto"
                        color={route.disabled ? gray : inactiveColor}
                      />
                    </Flex>
                  )}
                </AccordionButton>
                <AccordionPanel py="0px" ps="8px">
                  <List>
                    {route.items
                      ? createAccordionLinks(route.items)
                      : ''}
                  </List>
                </AccordionPanel>
              </AccordionItem>
              <Link
                isExternal
                href="https://horizon-ui.com/ai-template"
                mt="6px"
              >
                <Badge
                  display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                  colorScheme="brand"
                  borderRadius="25px"
                  color="brand.500"
                  textTransform="none"
                  letterSpacing="0px"
                  px="8px"
                >
                  PRO
                </Badge>
              </Link>
            </Flex>
          </Accordion>
        );
      } else if (!route.invisible) {
        return (
          <div key={key}>
            {route.icon ? (
              <Flex
                align="center"
                justifyContent="space-between"
                w="100%"
                maxW="100%"
                ps="17px"
                mb="14px"
              >
                <HStack
                  w="100%"
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                  }
                >
                  <NavLink
                    href={route.layout ? route.layout + route.path : route.path}
                    key={key}
                    styles={{ width: '100%' }}
                    onClick={onClose}
                  >
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      cursor={route.disabled ? 'not-allowed' : 'pointer'}
                      opacity={route.disabled ? 0.4 : 1}
                    >
                      <Box
                        color={
                          route.disabled
                            ? gray
                            : activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : inactiveColor
                        }
                        me="12px"
                        mt="6px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          route.disabled
                            ? gray
                            : activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : inactiveColor
                        }
                        fontWeight="500"
                        letterSpacing="0px"
                        fontSize="sm"
                      >
                        {route.name}
                      </Text>
                    </Flex>
                  </NavLink>
                </HStack>
                {route.disabled && (
                  <Link isExternal href="https://horizon-ui.com/ai-template">
                    <Badge
                      display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                      colorScheme="brand"
                      borderRadius="25px"
                      color="brand.500"
                      textTransform="none"
                      letterSpacing="0px"
                      px="8px"
                    >
                      PRO
                    </Badge>
                  </Link>
                )}
              </Flex>
            ) : (
              <ListItem ms={0} cursor={route.disabled ? 'not-allowed' : 'pointer'}>
                <Flex
                  ps="32px"
                  alignItems="center"
                  mb="8px"
                  opacity={route.disabled ? 0.4 : 1}
                >
                  <Text
                    color={
                      route.disabled
                        ? gray
                        : activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight="500"
                    fontSize="xs"
                  >
                    {route.name}
                  </Text>
                </Flex>
              </ListItem>
            )}
          </div>
        );
      }
    });
  };

  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => (
      <ListItem
        ms="28px"
        display="flex"
        alignItems="center"
        mb="10px"
        key={key}
        cursor={route.disabled ? 'not-allowed' : 'pointer'}
      >
        <Icon
          w="6px"
          h="6px"
          me="8px"
          as={FaCircle}
          color={route.disabled ? gray : activeIcon}
        />
        <NavLink
          href={route.layout ? route.layout + route.path : route.path}
          onClick={onClose}
        >
          <Text
            color={
              route.disabled
                ? gray
                : activeRoute(route.path.toLowerCase())
                ? activeColor
                : inactiveColor
            }
            fontWeight={
              activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
            }
            fontSize="sm"
          >
            {route.name}
          </Text>
        </NavLink>
      </ListItem>
    ));
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
