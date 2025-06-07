import { useTheme } from "@/hooks/theme";
import { ThemedText } from "./ThemedText";
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const TabsContext = createContext({
  activeValue: "",
  setActiveValue: (value: string) => {},
});

export const Tabs = ({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) => {
  const [activeValue, setActiveValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      {children}
    </TabsContext.Provider>
  );
};

export const TabsContent = ({
  children,
  style,
  value,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  value: string;
}) => {
  const { activeValue } = useContext(TabsContext);

  if (activeValue !== value) return null;

  return <View style={style}>{children}</View>;
};

export const TabsList = ({ children }: PropsWithChildren) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        backgroundColor: colors.card,
        padding: 4,
        borderRadius: 12,
      }}
    >
      {children}
    </View>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  const { colors } = useTheme();

  const { activeValue, setActiveValue } = useContext(TabsContext);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 8,
          borderRadius: 8,
          flex: 1,
        },
        activeValue === value && {
          backgroundColor: colors.background,
        },
      ]}
      onPress={() => {
        setActiveValue(value);
      }}
    >
      <ThemedText>{children}</ThemedText>
    </TouchableOpacity>
  );
};
