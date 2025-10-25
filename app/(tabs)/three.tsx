import { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { useBigkasLevels } from '@/hooks/useBigkasLevels';
import { useFocusEffect, useRouter } from 'expo-router';
import { imageSrc } from '@/Icons/icons';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import BigkasModal from '../modals/modal4All';
import { ProtectedScreen } from '@/routes/ProtectedScreen';
import BumalikBtn from '@/components/bumalikBtn';
import PlayBtn from '@/components/playBtn';

export default function TabThreeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { state, updateState } = useBigkasLevels();
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
                  source={imageSrc.bigkas}
                  style={styles.bigkasImage}
                />
                <PlayBtn disabled={state.isLoading} onPress={() => router.push('/bigkas/levelSelection')} />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
      {state.isModalOpen && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 20 }}>
          <BigkasModal
            type='bigkasInfo'
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
    right: 10,
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
  bigkasImage: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});