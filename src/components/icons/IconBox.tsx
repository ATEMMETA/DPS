'use client';
import React from 'react';
import { Flex } from '@chakra-ui/react';

export default function IconBox(props: { 
  icon: React.JSX.Element | string; // Change JSX.Element to React.JSX.Element
  [x: string]: any 
}): React.JSX.Element { // Add return type for good measure
  const { icon, ...rest } = props;

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      borderRadius={'50%'}
      {...rest}
    >
      {icon}
    </Flex>
  );
}
