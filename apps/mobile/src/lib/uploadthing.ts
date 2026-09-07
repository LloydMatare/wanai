import { generateReactNativeHelpers } from "@uploadthing/expo";
import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
const host = debuggerHost?.split(":")[0] ?? "localhost";

export const { useImageUploader } = generateReactNativeHelpers({
  url: process.env.EXPO_PUBLIC_UPLOADTHING_URL ?? `http://${host}:3000/api/uploadthing`,
});
