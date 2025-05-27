import { useTheme } from "@/hooks/theme";
import { View, Text, Image } from "react-native";

interface AvatarProps {
  name?: string;
  size?: number;
  image?: string | null;
  backgroundColor?: string;
}

export const Avatar = ({
  name,
  size = 32,
  image,
  backgroundColor,
}: AvatarProps) => {
  const { colors } = useTheme();

  if (image) {
    return (
      <Image
        height={size}
        width={size}
        style={{
          borderRadius: size / 2,
          backgroundColor: backgroundColor ?? colors.subtext,
          alignItems: "center",
          justifyContent: "center",
        }}
        source={{ uri: image }}
      />
    );
  }

  const firstChar = name?.[0]?.toUpperCase() || "?";

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: backgroundColor ?? "#2d2d2d",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: size / 2 }}>{firstChar}</Text>
    </View>
  );
};
