import { Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "PPNeueMontreal",
  fonts: [
    {
      src: "/fonts/PPNeueMontreal-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/PPNeueMontreal-Medium.ttf",
      fontWeight: 500,
    },
  ],
});

Font.register({
  family: "PPFragmentGlare",
  src: "/fonts/PPFragment-GlareMedium.ttf",
});
