import { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imageSrc } from '../../Icons/icons';
import { getWordImages } from '../../utils/helpers';
import useAudioQueue from '../../hooks/useAudioQueue';

interface BlackboardProps {
  phrase: {
    text: string;
    [key: string]: any;
  };
  wordResults: (null | boolean)[];
  isActive: boolean;
  onListen: () => void;
  showSpeed: boolean;
  updateState: (state: any) => void;
  onSpeak: (speed: "normal" | "slow") => void;
  audioQueue: ReturnType<typeof useAudioQueue>;
}

const Blackboard = memo(({ phrase, wordResults, isActive, onListen, showSpeed, updateState, onSpeak, audioQueue }: BlackboardProps) => {
  const { pause, resume, stop, isPlaying, isPaused } = audioQueue;
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <Image
        source={imageSrc.blackboard}
        style={{ 
          position: 'relative',
          width: 600,
          height: 400,
          zIndex: 0
        }}
        resizeMode="contain"
      />
      <View style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -230 }, { translateY: -120 }],
        width: '75%',
        maxWidth: '75%',
        height: '70%',
        maxHeight: '70%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: '100%',
          paddingLeft: 18,
          alignItems: 'flex-start',
        }}>
          {isPlaying ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
                <Text style={{
                  color: '#FFF9C4',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}>Nagsasalita...</Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 2,
                  gap: 2,
                }}>
                  {[...Array(4)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        {
                          width: 4,
                          height: 16,
                          backgroundColor: '#FFF9C4',
                          borderRadius: 2,
                          marginHorizontal: 1,
                        },
                        { opacity: 0.4 + (i % 2) * 0.6 }
                      ]}
                    />
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => (isPaused ? resume() : pause())}>
                    <Image source={isPaused ? imageSrc.play : imageSrc.pause} style={{ width: 40, height: 40 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity onPress={stop}>
                    <Image source={imageSrc.gameX} style={{ width: 40, height: 40 }} resizeMode='contain' />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <TouchableOpacity
                disabled={isActive}
                style={[{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 2,
                }, isActive ? {
                  opacity: 0.5,
                } : null]}
                onPress={() => updateState({ showSpeed: !showSpeed })}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: '#FFF9C4',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>I-tap upang makinig</Text>
                  <Ionicons name="volume-medium" size={28} color="#FFF9C4" style={{ marginLeft: 6 }} />
                </View>
              </TouchableOpacity>
              {showSpeed && (
                <View style={{ position: 'absolute', top: '100%', left: '35%', zIndex: 50, backgroundColor: '#003311', borderWidth: 2, borderColor: '#8a3903', borderRadius: 16, padding: 10, alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity onPress={() => onSpeak("normal")}>
                      <Image source={imageSrc.normalSpeed} style={{ width: 60, height: 60 }} resizeMode='contain' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onSpeak("slow")}>
                      <Image source={imageSrc.slowSpeed} style={{ width: 60, height: 60 }} resizeMode='contain' />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 12,
          paddingHorizontal: 12,
          width: '100%',
        }}>
          {phrase?.text.split(" ").map((word: string, idx: number) => (
            <Text
              key={idx}
              style={[
                {
                  textAlign: 'left',
                  fontSize: 24,
                  fontWeight: 'normal',
                  color: '#FFF9C4',
                  marginHorizontal: 4,
                  borderBottomWidth: 4,
                  borderColor: 'transparent',
                  paddingBottom: 2,
                },
                wordResults[idx] === true
                  ? { borderColor: 'green' }
                  : wordResults[idx] === false
                  ? { borderColor: 'red' }
                  : { borderColor: 'transparent' }
              ]}
            >
              {word}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          disabled={isActive}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
            }, isActive ? {
              opacity: 0.5,
            } : null
          ]}
          onPress={onListen}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {getWordImages("bigkasin", true).map((imageSrc, index) => (
              <Image
                key={index}
                source={imageSrc || ""}
                style={{
                  height: 36,
                  width: 36,
                  marginHorizontal: 2,
                  ...(index >= 0 && index <= 2 
                    ? { marginLeft: -18 }
                    : index >= 3 && index <= 5 ? { marginLeft: -12 }
                    : index >= 5 ? { marginLeft: -16 }
                    : {}
                  )
                }}
                resizeMode="contain"
              />
            ))}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Blackboard;