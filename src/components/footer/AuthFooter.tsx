// /components/Footer/AuthFooter.tsx
import { Box, Text, Link } from "@chakra-ui/react";

const AuthFooter = () => (
  <Box textAlign="center" mt="20px">
    <Text fontSize="xs" color="gray.400">
      &copy; {new Date().getFullYear()} Your App. All rights reserved.
      <Link href="/signup" ml="5px" color="teal.300">
        Sign Up
      </Link>
    </Text>
  </Box>
);

export default AuthFooter;
