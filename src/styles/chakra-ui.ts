import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  variants: {
    mobile_add_button: {
      color: "brand.light.fg",
      position: "fixed",
      bottom: 4,
      right: 4,
      size: "lg",
      style: {
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
        borderRadius: "50%",
      },
      _hover: {
        bg: "brand.dark.orange",
        _dark: { bg: "brand.light.orange" },
      },
      py: "30px",
      px: 4,
      bg: "brand.dark.orange",
      _dark: { bg: "brand.dark.orange", color: "brand.dark.fg" },
    },
  },
});

export const components = {
  Button,
};
