import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkeletonYunit from '@/app/skeletonLoaders/skeletonYunit';
import { useYunitsState } from '@/hooks/useYunitsState';
import { useRouter } from 'expo-router';
import { useClassContext } from '@/hooks/classContext';
import { StatusBar } from 'expo-status-bar';
import { imageSrc } from '@/Icons/icons';
import { ProtectedScreen } from '@/routes/ProtectedScreen';
import { useFocusEffect } from '@react-navigation/native';
import { MyYunitText } from '@/components/customText';

export default function TabTwoScreen() {
  const router = useRouter();
  const skeletonArray = Array.from({ length: 4 }, (_, index) => (
    <SkeletonYunit key={index} />
  ));
  const { setSelectedYunit } = useClassContext();
  const { state, refreshYunits } = useYunitsState();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      return undefined;
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshYunits();
    setRefreshing(false);
  };

  return (
    <ProtectedScreen requireVerifiedEmail={true}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#2C3E50' }}>
        <StatusBar style="light" />
        <MyYunitText />
        <ScrollView 
          style={{ backgroundColor: '#2C3E50' }} 
          contentContainerStyle={{ padding: 10, paddingBottom: 100, gap: 10 }} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2C3E50']}
              tintColor="#2C3E50"
            />
          }
        >
          {state.isLoading
            ? skeletonArray
            : state.yunits.length > 0 ? (
                state.yunits.map((unit: any, index: number) => (
                  <TouchableOpacity 
                    key={index} 
                    style={{ position: 'relative', backgroundColor: '#FFA600', borderRadius: 12, overflow: 'hidden' }}
                    disabled={unit.status === true && unit.unlocked === false}
                    onPress={() => {
                      setSelectedYunit(unit);
                      router.navigate('/lessons/yunitLessons');
                    }}
                  >
                    <Image source={{ uri: unit.imageurl }} style={{ width: '100%', height: 256, borderRadius: 12, resizeMode: 'contain' }} />
                    <Text style={{ position: 'absolute', top: 4, left: 4, padding: 8, borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)' }}>Yunit {unit.yunitnumber}</Text>
                    <Text style={{ position: 'absolute', bottom: 8, left: 8, color: '#fff', fontSize: 18, fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 18 }}>{unit.yunitname}</Text>
                    {unit.status === true && unit.unlocked === false && (
                      <View style={{ position: 'absolute', inset: 0, zIndex: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                        <Image source={imageSrc.locked} style={{ width: 64, height: 64, resizeMode: 'contain', marginBottom: 12 }} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>Locked</Text>
                        <Text style={{ fontSize: 14, marginTop: 4, textAlign: 'center', letterSpacing: 1, color: '#fff' }}>This yunit is currently locked.</Text>
                      </View>
                    )}
                    {unit.unlocked === true && (
                      <View style={{ position: 'absolute', top: 8, right: 8, gap: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, width: 120, backgroundColor: 'rgba(255,255,255,0.85)', }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: unit.status === true && unit.unlocked === false ? '#aaa' : '#2D3748' }}>
                          View lessons
                        </Text>
                        <Feather name="arrow-right-circle" size={18} color={unit.status === true && unit.unlocked === false ? "#aaa" : "#2D3748"} />
                      </View>
                    )}
                  </TouchableOpacity>
              ))
            ):(
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: 'transparent' }}>
                <MaterialIcons name="error-outline" size={64} color="#FFA600" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 16, textAlign: 'center', color: '#fff' }}>No Yunits Available</Text>
                <Text style={{ fontSize: 14, marginTop: 8, textAlign: 'center', color: '#fff' }}>You currently have no yunits. Please contact your teacher for more information.</Text>
              </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
