import { Image } from "@react-pdf/renderer";

interface PDFLogoProps {
  style?: {
    width?: number;
    height?: number;
    marginBottom?: number;
  };
}

export default function PDFLogo({ style }: PDFLogoProps) {
  return <Image src="/premiumcars-logo-dark.png" style={style} />;
}
