'use client';
import React from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchBarProps {
  variant?: 'search' | 'otherVariant'; //Example of variant usage
  background?: string;
  placeholder?: string;
  borderRadius?: string | number;
  [x: string]: any; // Consider refining this
}

export function SearchBar(props: SearchBarProps): React.JSX.Element {
  const {
    variant = 'search', // Default variant
    background,
    placeholder = 'Search', // More generic default
    borderRadius = '30px', // Default border radius
    ...rest
  } = props;

  const searchIconColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const inputText = useColorModeValue('gray.700', 'gray.100');

  return (
    <InputGroup w={{ base: '100%', md: '200px' }} {...rest}>
      <InputLeftElement>
        <IconButton
          aria-label="search"
          bg="inherit"
          borderRadius="inherit"
          _active={{
            bg: 'rgba(0, 0, 0, 0.1)', // Subtle active feedback
            transform: 'none',
            borderColor: 'transparent',
          }}
          _hover={{
            bg: 'rgba(0, 0, 0, 0.05)', // Subtle hover feedback
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{ boxShadow: 'none' }}
          icon={<SearchIcon color={searchIconColor} w="14px" h="14px" />}
        />
      </InputLeftElement>
      <Input
        variant={variant} // Use the variant prop
        fontSize="sm"
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: 'gray.500', fontSize: '14px' }}
        borderRadius={borderRadius}
        placeholder={placeholder}
      />
    </InputGroup>
  );
}
