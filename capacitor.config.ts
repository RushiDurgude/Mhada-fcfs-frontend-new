import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "com.mhada.ihlms",
  appName: "MHADA Lottery",
  webDir: "www",
  bundledWebRuntime: false,
  server: {
    cleartext: false,
    // hostname: "localhost",
    iosScheme: "http",
    // androidScheme: "http",
  },
  ios: {
    scheme: "http",
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
    PrivacyScreen: {
      enable: false,
    },
  },
};

export default config;
