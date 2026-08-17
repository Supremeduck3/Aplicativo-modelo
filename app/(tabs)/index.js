import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const codeverseLogo = require("../../assets/codeverse-logo.png");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
              <View style={styles.card_imagem}>
                  <Image
                
                  />
              </View>
        <View style={styles.filmes}>
            <Text style={styles.gostos}>O que eu gosto de fazer? </Text>
              </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
    alignItems:'center'
    },
    gostos: {
        backgroundColor: "#0873ff",
        height:300,
        width: 300,
        borderRadius: 20,
        textAlign: 'center'
        
    },
    card_imagem: {
        backgroundColor: "#0873ff",
        width: 300,
        height:200,
        borderRadius: 20,
        textAlign: 'center',
    },
});
