import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ContentContainer from '../components/ContentContainer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LoadingComponent from '../components/LoadingComponent';
import CitySelectionModal from '../components/CitySelectionModal';
import Toast from 'react-native-toast-message';


const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { userCity, setCurrentCity } = useAuth();
  const [showCityModal, setShowCityModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialConfigurations = [
    {
      id: 'cityChange',
      title: t('cityChange'),
      description: t('currentCity', { city: userCity }),
      action: 'CHANGE_CITY',
    },
    // Add more configurations here as needed
  ];


  const handleConfigurationAction = (action) => {
    switch (action) {
      case 'CHANGE_CITY':
        handleCityChange();
        break;
      // Add more cases for other configuration actions here
      default:
        break;
    }
  };

  const handleCityChange = () => {
    setShowCityModal(true);
  };

  const handleCitySave = async (city) => {
    setIsLoading(true);
    setShowCityModal(true);
    try {
      await setCurrentCity(city);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `${t('error')}`,
        text2: `${error.response?.data?.error || `${t('anErrorOccurred')}`}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleConfigurationAction(item.action)}
      style={styles.configurationItem}
    >
      <Text style={styles.configurationTitle}>{item.title}</Text>
      <Text style={styles.configurationDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ContentContainer>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('settings')}</Text>
        </View>

        <FlatList
          data={initialConfigurations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />

        {isLoading && <LoadingComponent />}
      </View>

      <CitySelectionModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
        onSave={handleCitySave}
      />
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0C5298',
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  configurationItem: {
    backgroundColor: 'white', // Set background color to white
    padding: 20,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomWidth: 1, // Add borderBottomWidth for the light gray border
    borderBottomColor: 'lightgray', // Set borderBottomColor to lightgray
  },
  configurationTitle: {
    color: '#0C5298', // Set text color to #0C5298
    fontSize: 18,
    fontWeight: 'bold',
  },
  configurationDescription: {
    color: '#0C5298', // Set text color to #0C5298
    fontSize: 14,
    marginTop: 5
  },
});

export default SettingsScreen;
