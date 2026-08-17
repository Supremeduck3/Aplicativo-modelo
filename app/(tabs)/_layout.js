import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShadowVisible: false,
                tabBarActiveTintColor: "#0f62fe",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#ffffff",
                },
                headerTitleStyle: {
                    color: "#000000"
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Início",
                    headerTitle: "Home",
                }}
            />
            <Tabs.Screen
                name="aulas"
                options={{
                    title: "Aulas",
                    headerTitle: "Conteúdo",
                }}
            />
        </Tabs>
    );

}