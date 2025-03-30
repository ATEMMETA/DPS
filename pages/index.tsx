import { Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Box textAlign="center" py="20">
      <Heading>Welcome to DPS</Heading>
      <Text mt="4">
        Go to{" "}
        <Link href="/signin" style={{ color: "teal" }}>
          Sign In
        </Link>
      </Text>
    </Box>
  );
}
