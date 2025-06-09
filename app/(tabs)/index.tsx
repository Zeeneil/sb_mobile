import { StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase/firebase';
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { ScrollView, Image } from 'react-native';

export default function TabOneScreen() {

  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    router.push({
      pathname: '/loginPage',
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FB' }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <TouchableOpacity
        onPress={() => handleSignOut()}
        className='bg-[#2C3E50] rounded-lg px-10 py-5'
      >
        <Text lightColor="#eee">Sign out</Text>
      </TouchableOpacity>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View>
          <Text style={styles.greeting}>Kumusta, Zyron!</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Replace with your icons */}
          <View style={styles.iconPlaceholder} />
          <View style={styles.iconPlaceholder} />
        </View>
      </View>

      {/* Banner/Notification */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Tapusin ang iyong pagsusulit ngayon!</Text>
      </View>

      {/* Aking Aralin */}
      <Text style={styles.sectionTitle}>Aking Aralin</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
        {/* <Image source={require('@/assets/alphabet.png')} style={styles.lessonCard} />
        <Image source={require('@/assets/nouns.png')} style={styles.lessonCard} />
        <Image source={require('@/assets/other.png')} style={styles.lessonCard} /> */}
      </ScrollView>
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Ipagpatuloy ang Pagkatuto</Text>
      </TouchableOpacity>

      {/* Paparating na pagsusulit */}
      <Text style={styles.sectionTitle}>Paparating na pagsusulit</Text>
      <View style={styles.quizCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {/* Replace with your icon */}
          <View style={styles.quizIcon} />
          <Text style={styles.quizAlert}>Available na ang bagong quiz!</Text>
        </View>
        <Text style={styles.quizLabel}>Pamagat: <Text style={{ fontWeight: 'bold' }}>“Filipino Basics”</Text></Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={styles.quizDate}>Simula: March 6, 2025</Text>
          <TouchableOpacity>
            <Text style={styles.quizDetail}>Detalye</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mga natapos na aralin */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Mga natapos na aralin</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Tingnan ang lahat</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        <View style={styles.completedCard}>
          {/* <Image source={require('@/assets/images/alphabet.jfif')} style={styles.completedImage} /> */}
          <Text style={styles.completedLabel}>Pagkilala sa Alpabeto</Text>
          {/* Add star icon at top right if needed */}
        </View>
        <View style={styles.completedCard}>
          {/* <Image source={require('@/assets/nouns.png')} style={styles.completedImage} /> */}
          <Text style={styles.completedLabel}>Pangngalan at Pandiwa</Text>
        </View>
        <View style={styles.completedCard}>
          {/* <Image source={require('@/assets/other.png')} style={styles.completedImage} /> */}
          <Text style={styles.completedLabel}>Tamang Bigkas at Diin</Text>
        </View>
        <View style={styles.completedCard}>
          {/* <Image source={require('@/assets/alphabet.png')} style={styles.completedImage} /> */}
          <Text style={styles.completedLabel}>Pagkilala sa Alpabeto</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  banner: {
    backgroundColor: '#E3F0FF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  bannerText: {
    color: '#2176FF',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  lessonCard: {
    width: 140,
    height: 90,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  ctaButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  quizIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginRight: 6,
  },
  quizAlert: {
    color: '#FF9900',
    fontWeight: 'bold',
    fontSize: 12,
  },
  quizLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  quizDate: {
    fontSize: 12,
    color: '#888',
  },
  quizDetail: {
    fontSize: 12,
    color: '#2176FF',
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#2176FF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  completedCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  completedImage: {
    width: 120,
    height: 60,
    borderRadius: 12,
    marginBottom: 6,
  },
  completedLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
