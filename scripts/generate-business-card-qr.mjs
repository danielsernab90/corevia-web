import QRCode from "qrcode";
import fs from "fs";

const url = "https://corevia-web-iota.vercel.app/es/empezar";

fs.mkdirSync("./public/qr", { recursive: true });

await QRCode.toFile(
  "./public/qr/corevia-business-card.svg",
  url,
  {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1200,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  }
);

console.log("✅ Business card QR generated!");
console.log(`📍 ${url}`);
console.log("📁 public/qr/corevia-business-card.svg");