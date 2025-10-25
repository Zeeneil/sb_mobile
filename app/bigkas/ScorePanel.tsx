import { memo, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { imageSrc } from '../../Icons/icons';
import { getNumberImages, getStarImages } from '../../utils/helpers';

interface ScorePanelProps {
  mode: string;
  phrases: any[];
  totalPoints: number;
  totalWords: number;
  showPopup: boolean;
  isActive: boolean;
  userTotalPoints: number;
  userTotalWords: number;
}

const ScorePanel = memo(({ mode, phrases, totalPoints, totalWords, showPopup, isActive, userTotalPoints, userTotalWords }: ScorePanelProps) => {
  const latestEarnedPoints = phrases?.length > 0 ? (phrases.slice().reverse().find(p => p.isContinue === true && p.userPoints > 0)?.userPoints || 0) : 0;

  const renderNumberImages = (num: number, size = 50) => (
    getNumberImages(num)?.map((img, idx) => (
      <Image key={idx} source={img} style={{ height: size, width: size * 0.7, resizeMode: 'contain' }} />
    ))
  );

  // Popup animation
  const popupAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (showPopup) {
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showPopup, popupAnim]);

  return (
    <View style={styles.root}>
      <View style={styles.topSection}>
        {/* Stars */}
        <View style={styles.starsRow}>
          {getStarImages(mode).map((img, idx) => (
            <Image key={idx} source={img} style={styles.starIcon} />
          ))}
        </View>
        {/* Total Points */}
        <View style={styles.pointsSection}>
          <Text style={styles.label}>Puntos</Text>
          <View style={styles.pointsRow}>
            {renderNumberImages(userTotalPoints, 30)}
            <Image source={imageSrc.slash} style={styles.slashIcon} />
            {renderNumberImages(totalPoints, 30)}
          </View>
        </View>
        {/* Total Words */}
        <View style={styles.wordsSection}>
          <Text style={styles.label}>Mga tamang salita</Text>
          <View style={styles.wordsRow}>
            {renderNumberImages(userTotalWords, 30)}
            <Image source={imageSrc.slash} style={styles.slashSmallIcon} />
            {renderNumberImages(totalWords, 30)}
          </View>
        </View>
      </View>
      {/* Popup Score */}
      <Animated.View
        style={[
          styles.popup,
          {
            opacity: popupAnim,
            transform: [
              {
                translateY: popupAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        {showPopup && (
          <View style={styles.popupRow}>
            <Image source={imageSrc.plus} style={styles.plusIcon} />
            {renderNumberImages(latestEarnedPoints, 60)}
          </View>
        )}
      </Animated.View>
      <Image
        source={isActive ? imageSrc.happyRobot : imageSrc.angryRobot}
        style={styles.characterIcon}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: 180,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 8,
    paddingTop: 24,
  },
  topSection: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  starsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  starIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
  pointsSection: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  slashIcon: {
    height: 30,
    width: 24,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  wordsSection: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  wordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  slashSmallIcon: {
    height: 40,
    width: 18,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  popup: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'absolute',
    top: 60,
    left: 0,
    zIndex: 10,
  },
  popupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  plusIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  characterIcon: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
  },
});

export default ScorePanel;