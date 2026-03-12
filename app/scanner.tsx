// import { bg } from "@/assets/css/css";
// import BottomBar from "@/components/bottom-bar";
// import TopBar from "@/components/top-bar";
// import { useRouter } from "expo-router";
// import {
//   Image
// } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// export default function ScannerScreen() {
//   const [torchOn, setTorchOn] = useState(false);
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      
//            <TopBar title= "MY Account"/>


//       {/* Scanner Area */}
//       <View style={styles.cameraArea}>
//         <ImageBackground
//           source={{
//             uri: "",
//           }}
//           resizeMode="cover"
//           style={styles.cameraBackground}
//         >
//           <View style={styles.scanBox}>
//             <View style={[styles.corner, styles.topLeft]} />
//             <View style={[styles.corner, styles.topRight]} />
//             <View style={[styles.corner, styles.bottomLeft]} />
//             <View style={[styles.corner, styles.bottomRight]} />
//           </View>
//         </ImageBackground>
//       </View>

//       {/* Instructions */}
//       <View style={styles.instructions}>
//         <Text style={styles.instructionsText}>
//           Point camera at barcode
//         </Text>
//       </View>

//       {/* Buttons */}
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.circleButton}>
//           <Image size={26} color="#fff" />
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={styles.torchButton}
//           onPress={() => setTorchOn(!torchOn)}
//         >
//           <Flashlight size={26} color="#000" />
//         </TouchableOpacity> */}
//       </View>

//       {/* Bottom Navigation */}
//      <BottomBar />

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: bg.primary,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },

//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   cameraArea: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   cameraBackground: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   scanBox: {
//     width: 260,
//     height: 260,
//     borderRadius: 24,
//     borderWidth: 3,
//     borderColor: bg.secondary,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   corner: {
//     position: "absolute",
//     width: 30,
//     height: 30,
//     borderColor: "#d4af37",
//   },

//   topLeft: {
//     top: 0,
//     left: 0,
//     borderLeftWidth: 4,
//     borderTopWidth: 4,
//   },

//   topRight: {
//     top: 0,
//     right: 0,
//     borderRightWidth: 4,
//     borderTopWidth: 4,
//   },

//   bottomLeft: {
//     bottom: 0,
//     left: 0,
//     borderLeftWidth: 4,
//     borderBottomWidth: 4,
//   },

//   bottomRight: {
//     bottom: 0,
//     right: 0,
//     borderRightWidth: 4,
//     borderBottomWidth: 4,
//   },

//   instructions: {
//     paddingVertical: 20,
//     alignItems: "center",
//   },

//   instructionsText: {
//     color: "#fff",
//     fontSize: 16,
//   },

//   actions: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 20,
//     paddingBottom: 100,
//   },

//   circleButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#1e293b",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   torchButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#d4af37",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   bottomNav: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     borderTopWidth: 1,
//     borderColor: "#1e293b",
//     backgroundColor: "#0f172a",
//     paddingVertical: 10,
//   },

//   navItem: {
//     alignItems: "center",
//   },

//   navText: {
//     color: "#fff",
//     fontSize: 12,
//   },

//   scanButton: {
//     backgroundColor: "#d4af37",
//     padding: 16,
//     borderRadius: 40,
//   },
// });

import { bg } from "@/assets/css/css";
import BottomBar from "@/components/bottom-bar";
import TopBar from "@/components/top-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Image } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ color: "#fff" }}>
          Camera permission is required
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#d4af37", marginTop: 10 }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = ({ data }: any) => {
    if (scanned) return;

    setScanned(true);

    const slug = data.trim();

    router.push(`/products/${slug}`);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar title="MY Account" />

      {/* Camera */}
      <View style={styles.cameraArea}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleScan}
        />

        {/* Scan Box */}
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Point camera at QR code
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.circleButton}>
          <Image size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.torchButton}
          onPress={() => setTorchOn(!torchOn)}
        >
          <Text>🔦</Text>
        </TouchableOpacity>
      </View>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg.primary,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bg.primary,
  },

  cameraArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: bg.secondary,
  },

  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#d4af37",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
  },

  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },

  instructions: {
    paddingVertical: 20,
    alignItems: "center",
  },

  instructionsText: {
    color: "#fff",
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 100,
  },

  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },

  torchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#d4af37",
    alignItems: "center",
    justifyContent: "center",
  },
});