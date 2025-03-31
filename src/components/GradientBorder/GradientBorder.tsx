import { Box, BoxProps } from "@chakra-ui/react";

interface GradientBorderProps extends BoxProps {
  backgroundImage?: string;
  borderRadius?: string;
  width?: string;
  minWidth?: string;
}

function GradientBorder({ backgroundImage, children, borderRadius, width, minWidth, ...rest }: GradientBorderProps) {
  return (
    <Box
      padding="2px"
      width={width}
      minWidth={minWidth}
      height="fit-content"
      borderRadius={borderRadius}
      sx={{
        height: "fit-content",
        backgroundImage: backgroundImage
          ? backgroundImage
          : "radial-gradient(94.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export default GradientBorder;
