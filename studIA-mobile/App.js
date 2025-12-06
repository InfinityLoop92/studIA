import React from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://tuo-progetto-vercel.vercel.app" }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f3ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
