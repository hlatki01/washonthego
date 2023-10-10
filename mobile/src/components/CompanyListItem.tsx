import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDistance } from 'geolib'; // Import geolib for calculating distances
import { useTranslation } from 'react-i18next';

const CompanyListItem = ({ company, onPress, onFavoritePress, userLocation }) => {
  const { t } = useTranslation();

  const { latitude, longitude, address, phone } = company;
  const distance = userLocation   
    ? `${(getDistance(userLocation, { latitude, longitude }) / 1000).toFixed(2)} km`
    : '';

  return (
    <TouchableOpacity onPress={() => onPress(company)}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{company.name}</Text>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); onFavoritePress(company); }}>
            <Icon
              name="star"
              size={20}
              color={company.favorite ? 'yellow' : 'lightgray'}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.iconTextContainer}>
            <Icon name="whatsapp" size={16} color="green" style={styles.icon} />
            <Text style={styles.details}>{phone}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Icon name="map-marker" size={16} color="blue" style={styles.icon} />
            <Text style={styles.details}>{address}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Icon name="location-arrow" size={16} color="orange" style={styles.icon} />
            <Text style={styles.details}>{t('distance')}: {distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
});

export default CompanyListItem;
