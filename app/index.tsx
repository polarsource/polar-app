import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/hooks/theme";
import LogoIcon from "@/components/Shared/PolarLogo";
import { useOAuth } from "@/hooks/oauth";
import { ThemedText } from "@/components/Shared/ThemedText";
import { Image } from "expo-image";

export default function App() {
  const { session, setSession } = useSession();
  const { colors } = useTheme();
  const { authRequest, authenticate } = useOAuth();

  if (session) {
    return <Redirect href="/(authenticated)/home" />;
  }

  return (
    <SafeAreaView
      style={[LoginStyle.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/images/login-background.jpg")}
        style={LoginStyle.background}
      />
      <LogoIcon size={80} />
      <ThemedText style={LoginStyle.title}>
        Payment infrastructure for the 21st century
      </ThemedText>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!authRequest}
        style={[
          LoginStyle.button,
          { backgroundColor: "#fff", borderRadius: 100 },
        ]}
        onPress={authenticate}
        onLongPress={() => {
          setSession(process.env.EXPO_PUBLIC_POLAR_DEMO_TOKEN ?? null);
        }}
      >
        <Text style={[LoginStyle.buttonText, { color: colors.monochrome }]}>
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 54,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 42,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 54,
    marginHorizontal: 32,
  },
  button: {
    width: "auto",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
});
