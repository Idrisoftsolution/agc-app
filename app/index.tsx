// import { Zap } from "lucide-react-native";
// import { Text, View } from "react-native";
// import "../global.css";
// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//       className="bg-red-400"
//     >
//       <Text>
//         <Zap/>
//         afsan
//         Edit app/index.tsx to edit this screen.
//       </Text>
//     </View>
//   );
// }

import { bg } from "@/assets/css/css";
import AlearDialog, { AlertDialogAction, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

function Index() {
  const [email, setEmail] = useState("afsan55official@gmail.com");
  const [password, setPassword] = useState("Afsan@9004");
  const  router = useRouter();
  const {login} = useAuth();
  const [error,setError] = useState("")

  const handleLogin = async () => {
    // console.log("Login pressed", email, password);
    const req = await login(email,password)
    console.log(req)
    if(req.success){
      router.push("/catalog");
    } else{
      setError(req.message || "something went wrong")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AGC</Text>

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email or Phone"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <Text style={styles.createAccount}>Create Account</Text>
      </TouchableOpacity> */}
      {/* <AlearDialog open={!!error} setOpen={setError} >{error}</AlearDialog> */}
      <AlearDialog open={!!error} setOpen={()=> setError("")}>
  <AlertDialogTitle>Login Failed</AlertDialogTitle>

  <AlertDialogDescription>
    {error}
  </AlertDialogDescription>

  <AlertDialogFooter>
    {/* <AlertDialogCancel onPress={() => setError("")}>
      Cancel
    </AlertDialogCancel> */}

    <AlertDialogAction onPress={() => setError("")}>
      Login Again
    </AlertDialogAction>
  </AlertDialogFooter>
</AlearDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: bg.primary
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#e5e7eb",
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e5e7eb",
    marginBottom: 30
  },
  input: {
    backgroundColor: bg.secondary,
    padding: 14,
    borderRadius: 8,
    color: "#e5e7eb",
    marginBottom: 14
  },
  forgot: {
    textAlign: "center",
    color: "#9ca3af",
    marginBottom: 20
  },
  loginButton: {
    backgroundColor: bg.tertiary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20
  },
  loginText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff"
  },
  createAccount: {
    textAlign: "center",
    color: bg.tertiary,
    fontWeight: "600"
  },
    navItem: {
    alignItems: "center",
  },
});

export default Index