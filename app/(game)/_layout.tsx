import type React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { Stack } from "expo-router";

export default function GameLayout() {
  const colorScheme = useColorScheme();

  return <Stack />;
}


