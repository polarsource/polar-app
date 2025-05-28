import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/hooks/theme";
import LogoIcon from "@/components/Common/PolarLogo";
import { useOAuth } from "@/hooks/oauth";

export default function App() {
  const { session } = useSession();
  const { colors } = useTheme();
  const { authRequest, promptAsync } = useOAuth();

  if (!authRequest) {
    return <View style={LoginStyle.container} />;
  }

  if (session) {
    return <Redirect href="/(authenticated)/home" />;
  }

  return (
    <SafeAreaView
      style={[LoginStyle.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />
      <LogoIcon size={80} />
      <Text style={[LoginStyle.title, { color: colors.text }]}>
        Payment infrastructure for the 21st century
      </Text>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!authRequest}
        style={[
          LoginStyle.button,
          { backgroundColor: "#fff", borderRadius: 100 },
        ]}
        onPress={() => {
          promptAsync().then(console.log);
        }}
      >
        <Text style={[LoginStyle.buttonText, { color: "#000" }]}>
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
  title: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 52,
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
