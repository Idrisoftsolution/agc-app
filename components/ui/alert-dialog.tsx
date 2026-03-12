import { bg } from "@/assets/css/css";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const AlearDialog = ({ open, setOpen, children }) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const AlertDialogTitle = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

export const AlertDialogDescription = ({ children }) => (
  <Text style={styles.description}>{children}</Text>
);

export const AlertDialogFooter = ({ children }) => (
  <View style={styles.footer}>{children}</View>
);

export const AlertDialogAction = ({ children, onPress }) => (
  <Text onPress={onPress} style={styles.primaryButton}>
    {children}
  </Text>
);

export const AlertDialogCancel = ({ children, onPress }) => (
  <Text onPress={onPress} style={styles.cancelButton}>
    {children}
  </Text>
);

export default AlearDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  dialog: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: bg.primary,
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "white",
    marginBottom: 20,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: "#444",
  },

  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: "white",
    backgroundColor: bg.tertiary,
    borderRadius: 6,
    overflow: "hidden",
  },
});