import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleNavigation = (path: any) => {
        if (pathname !== path) {
            router.push({
                pathname: path,
            });
        }
    };

    const handleLogin = async () => {
        if (isSigningIn) return;
        setIsSigningIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            handleNavigation('/(tabs)');
        } catch (error) {
            Alert.alert(`We couldn't find your account. Please check your email and password.`);
        } finally {
            setIsSigningIn(false);
        }
      };

    return (
        <View className="flex-1 justify-center">
            <View className="h-[40%] justify-center items-center">
                <Image
                    source={require('../assets/images/sb-symbol.png')}
                    style={styles.logo}
                />
            </View>
            <View className="h-[60%] bg-[#2C3E50] px-10 py-8 rounded-tl-[40px] rounded-tr-[40px] shadow-lg">
                <Text className="text-2xl font-bold mb-4 text-left text-white">Login</Text>
                <View className="justify-center items-center mt-5 w-full">
                    <View className="w-full relative">
                        <TextInput
                            className="w-full h-12 mb-3 bg-white rounded-lg px-4 shadow"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Ionicons
                            className="absolute top-3 right-4"
                            name="person"
                            size={24}
                            color="black"
                        />
                    </View>
                    <View className="w-full relative mt-1">
                        <TextInput
                            className="w-full h-12 mb-3 bg-white rounded-lg px-4 shadow"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            className='absolute top-3 right-4'
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={handleLogin} className="w-full bg-white mt-2 py-5 rounded shadow items-center justify-center">
                    <Text className="text-lg font-bold">Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 200,
        objectFit: 'contain',
    },
});