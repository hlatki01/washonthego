import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Linking, Button, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';
import { listCompanies } from '../services/CompanyService';
import { create, getByUser } from '../services/FavoriteService';
import ContentContainer from '../components/ContentContainer';
import CompanyModal from '../components/CompanyModal';
import * as Location from 'expo-location'; // Import Location from expo-location package
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
import LoadingComponent from '../components/LoadingComponent';
import { FlatList } from 'react-native-gesture-handler';
import CompanyListItem from '../components/CompanyListItem';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const CompaniesScreen = () => {
    const { t } = useTranslation();

    const { userId, userCity } = useAuth();
    const [userLocation, setUserLocation] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCompanyFavorited, setIsCompanyFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnModal, setIsLoadingOnModal] = useState(false);
    const [mapView, setMapView] = useState(true);
    const [currentUserCity, setCurrentUserCity] = useState('');

    const fetchCompaniesNearLocation = useCallback(async (city) => {
        try {
            setIsLoading(true)
            setIsLoadingOnModal(true)
            const currentUserLocation = await getLocationAsync(city || userCity);
            if (currentUserLocation) {
                setUserLocation(currentUserLocation)
            }
            if (currentUserLocation) {
                const companiesData = await listCompanies();
                const companiesWithLatLng = await Promise.all(
                    companiesData.map(async (company) => {
                        const address = `${company.address[0].road} ${company.address[0].number}, ${company.address[0].city}`;
                        try {
                            const favoritesData = await getByUser(userId)
                            const response = await axios.get(
                                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);

                            const data = response.data;
                            const { results } = data
                            if (data && results.length > 0) {
                                const { geometry } = results[0]
                                const { location } = geometry
                                const { lat, lng } = location;
                                company.latitude = lat;
                                company.longitude = lng;
                                company.address = address
                                company.favorite = favoritesData.some((favorite) => favorite.companyId === company.id);
                                const favorite = favoritesData.find((favorite) => favorite.companyId === company.id);
                                company.favoriteId = favorite ? favorite.id : null;
                                const userLatitude = currentUserLocation ? currentUserLocation.lat : null;
                                const userLongitude = currentUserLocation ? currentUserLocation.lng : null;
                                const distance = calculateDistance(userLatitude, userLongitude, company.latitude, company.longitude);
                                const maxDistance = 5000;
                                if (distance <= maxDistance) {
                                    return company;
                                } else {
                                    return null;
                                }
                            } else {
                                console.warn('Location not found:', address);
                                return null;
                            }
                        } catch (error) {
                            console.error('Error geocoding address:', error);
                            return null;
                        } finally {
                            setIsLoadingOnModal(false);
                            setIsLoading(false);
                        }
                    })
                );
                setCompanies(companiesWithLatLng.filter((company) => company !== null));

            } else {
                console.log("User Location Not Available");
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setIsLoadingOnModal(false);
            setIsLoading(false);
        }
    }, [userCity]);

    const getLocationAsync = async (userCity) => {
        try {
            if (!userCity) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                return location
            } else {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${userCity}&key=${GOOGLE_MAPS_API_KEY}`
                );
                const data = response.data;
                const { results } = data;
                if (data && results.length > 0) {
                    const { geometry } = results[0];
                    const { location } = geometry;
                    return location

                } else {
                    console.warn('City not found');
                }
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance * 1000; // Convert distance to meters
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    if (userCity) {
                        setCurrentUserCity(userCity)
                    }
                    const location = await getLocationAsync(userCity);
                    if (location) {
                        setUserLocation(location);
                        await fetchCompaniesNearLocation(userCity);
                    }
                } catch (error) {
                    console.error("Error Fetching Data:", error);
                }
            };
            fetchData();
            return () => {
                setUserLocation(null);
                setCurrentUserCity('');
            };
        }, [userCity]) // Add userCity as dependency
    );

    useFocusEffect(
        useCallback(() => {
            if (selectedCompany) {
                setIsCompanyFavorited(selectedCompany.favorite);
            }
        }, [selectedCompany])
    );

    useEffect(() => {
        if (selectedCompany) {
            const updatedSelectedCompany = companies.find(c => c.id === selectedCompany.id);
            if (updatedSelectedCompany) {
                setSelectedCompany(updatedSelectedCompany);
                setIsCompanyFavorited(updatedSelectedCompany.favorite);
            }
        }
    }, [selectedCompany]);

    const handleMarkerPress = (company) => {
        setSelectedCompany(company);
        setIsCompanyFavorited(company.favorite);
        setIsModalVisible(true);
    };

    const closeModal = async () => {
        setIsModalVisible(false);
        setSelectedCompany(null);
        setIsCompanyFavorited(false);
    };

    const onStartNavigation = (company) => {
        const { latitude, longitude } = company;
        const destination = `${latitude},${longitude}`;
        const iosUrl = `http://maps.apple.com/?daddr=${destination}`;
        const androidUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

        const openMapsApp = (url) => {
            Linking.openURL(url).catch(() => {
                // Handle error if the navigation app fails to open
                console.error('Error opening navigation app');
            });
        };

        const openWithUserChoice = () => {
            let url = Platform.select({
                ios: iosUrl,
                android: androidUrl,
            });

            Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                    openMapsApp(url);
                } else {
                    console.log("No navigation app available, opening in browser");
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
                }
            }).catch(() => {
                console.error('Error checking if URL can be opened');
            });
        };

        openWithUserChoice();
        setIsModalVisible(false);
        setSelectedCompany(null);
    };

    const onOpenWhatsApp = (company) => {
        const { phone } = company;
        const text = 'Vi seu lavacar no WashOnTheGo e gostaria de mais informações!'
        const url = `https://api.whatsapp.com/messager?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}`;
        Linking.openURL(url);
        setIsModalVisible(false);
        setSelectedCompany(null);
    };

    const onFavoritePress = async (company) => {
        setIsLoading(true)
        const favoriteData = {
            companyId: company.id,
            userId: userId
        };

        try {
            await create(favoriteData);
            const updatedSelectedCompany = companies.find(c => c.id === company.id);
            if (updatedSelectedCompany) {
                setSelectedCompany(updatedSelectedCompany);
                setIsCompanyFavorited(updatedSelectedCompany.favorite); // Update favorite status
            }
        } catch (error) {
            console.error('Error favoriting company:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const handleListItemPress = (company) => {
        setSelectedCompany(company);
        setIsCompanyFavorited(company.favorite);
        setIsModalVisible(true);
    };

    return (
        <ContentContainer>
            <View style={styles.titleContainer}>
                <View>
                    <Text style={styles.title}>{t('companiesAround')}</Text>
                    <Text style={styles.subTitle}>Região: {userCity}</Text>
                </View>
                <View style={styles.toggleButtonsContainer}>
                    {mapView && (
                        <TouchableOpacity onPress={() => setMapView(false)}>
                            <FontAwesome
                                name="map"
                                size={24}
                                style={[styles.toggleButton, styles.activeButton]}
                            />
                        </TouchableOpacity>
                    )}
                    {!mapView && (
                        <TouchableOpacity onPress={() => setMapView(true)}>
                            <FontAwesome
                                name="list"
                                size={24}
                                style={[styles.toggleButton, styles.activeButton]}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isLoading && <LoadingComponent />}
            {!isLoading && mapView && (
                <>
                    <View style={styles.container}>
                        {userLocation && (
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                {companies.map((company) => (
                                    <Marker
                                        key={company.id}
                                        coordinate={{
                                            latitude: parseFloat(company.latitude),
                                            longitude: parseFloat(company.longitude),
                                        }}
                                        onPress={() => handleMarkerPress(company)}
                                    />
                                ))}
                            </MapView>
                        )}
                    </View>
                </>
            )}
            {!companies.length && !isLoading && !mapView && (
                <View style={styles.emptyContainer}>
                    <Icon name="frown-o" size={50} color="#0C5298" />
                    <Text style={styles.emptyText}>{t('noCompanies')}</Text>
                </View>
            )}

            {!isLoading && !mapView && (
                <FlatList
                    data={companies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        <CompanyListItem
                            company={item}
                            onPress={handleListItemPress}
                            onFavoritePress={onFavoritePress}
                            userLocation={userLocation}
                        />
                    }
                />
            )}
            <CompanyModal
                isVisible={isModalVisible}
                company={selectedCompany}
                onClose={closeModal}
                onStartNavigation={onStartNavigation}
                onOpenWhatsApp={onOpenWhatsApp}
                onFavoritePress={onFavoritePress}
                isFavorited={isCompanyFavorited}
                isLoadingOnModal={isLoadingOnModal}
            />
        </ContentContainer>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    searchButton: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    radiusContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    radiusButton: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    container: {
        flex: 1,
        paddingTop: 20,
    },
    map: {
        flex: 1,
    },
    calloutContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    navigationButton: {
        marginTop: 10,
        backgroundColor: '#DDDDDD',
        padding: 8,
        borderRadius: 5,
    },
    toggleButtonContainer: {
        alignItems: 'flex-end',
        margin: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 25
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        color: "#0C5298",
        marginBottom: 6

    },
    subTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'left',
        color: "#0C5298"

    },
    toggleButtonsContainer: {
        flexDirection: 'row',
    },
    toggleButton: {
        marginHorizontal: 10,
    },
    activeButton: {
        color: '#0C5298', // Change the color to indicate active view
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'normal',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CompaniesScreen;
