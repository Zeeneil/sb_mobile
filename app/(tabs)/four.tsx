import { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { imageSrc } from '@/Icons/icons';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import SeatworkModal from '../modals/modal4All';
import { useSeatworksState } from '@/hooks/useSeatworksState';
import { ProtectedScreen } from '@/routes/ProtectedScreen';
import PlayBtn from '@/components/playBtn';
import BumalikBtn from '@/components/bumalikBtn';

export default function TabFourScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { state, updateState } = useSeatworksState();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      return undefined;
    }, [])
  );

  return (
    <ProtectedScreen requireVerifiedEmail={true}>
      <SafeAreaView style={styles.SafeAreaView}>
        <StatusBar style="dark" />
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => updateState({ isModalOpen: true })}
        >
          <Image source={imageSrc.gameInfo} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <BumalikBtn 
          onPress={() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).then(() => {
              router.back();
            });
          }}
          size={24}
        />
        {state.isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <ActivityIndicator size="large" color="#2C3E50" />
          </View>
        ):(
          <View style={[styles.container, { width: SCREEN_WIDTH - 12, height: SCREEN_HEIGHT }]}>
            <View style={styles.imageButtonContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={imageSrc.seatwork}
                  style={styles.seatworkImage}
                />
                <PlayBtn disabled={state.isLoading} onPress={() => router.navigate('/seatwork/Seatworks')} />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
      {state.isModalOpen && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 20 }}>
          <SeatworkModal
            type='seatworkInfo'
            isOpen={state.isModalOpen}
            onClose={() => updateState({ isModalOpen: false })}
          />
        </View>
      )}
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFA600',
  },
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA600',
  },
  headerTitle: {
    position: 'absolute',
    zIndex: 10,
    top: 20,
    left: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  imageButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  imageWrapper: {
    position: 'relative',
    width: 500,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  seatworkImage: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});