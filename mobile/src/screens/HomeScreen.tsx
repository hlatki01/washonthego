import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Linking, Platform } from 'react-native';
import * as Location from 'expo-location'; // Import Location from expo-location package
import ContentContainer from '../components/ContentContainer';
import { listCompanies } from '../services/CompanyService';
import CompanyListItem from '../components/CompanyListItem';
import LoadingComponent from '../components/LoadingComponent';
import { FlatList } from 'react-native-gesture-handler';
import { useAuth } from '../context/AuthContext';
import { getByUser } from '../services/FavoriteService';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
import CompanyModal from '../components/CompanyModal';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const { t } = useTranslation();

    const { userId } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnModal, setIsLoadingOnModal] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingOnModal(true);
            setIsLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
            const companiesData = await listCompanies();
            const companiesWithLatLng = await Promise.all(
                companiesData.map(async (company) => {
                    const address = `${company.address[0].road} ${company.address[0].number}, ${company.address[0].city}`;
                    try {
                        const favoritesData = await getByUser(userId);
                        const response = await axios.get(
                            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
                        );
                        const data = response.data;
                        const { results } = data;
                        if (data && results.length > 0) {
                            const { geometry } = results[0];
                            const { location } = geometry;
                            const { lat, lng } = location;
                            company.latitude = lat;
                            company.longitude = lng;
                            company.address = address;
                            company.favorite = favoritesData.some(
                                (favorite) => favorite.companyId === company.id
                            );
                            const favorite = favoritesData.find(
                                (favorite) => favorite.companyId === company.id
                            );
                            company.favoriteId = favorite ? favorite.id : null;
                            return company.favorite ? company : null;
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
        } catch (error) {
            console.error('Error fetching companies:', error);
            setIsLoadingOnModal(false);
            setIsLoading(false);

        } finally {
            setIsLoadingOnModal(false);
            setIsLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            return () => {
                // Cleanup logic (if needed) when component is unmounted
            };
        }, [fetchData])
    );

    const closeModal = async () => {
        setIsModalVisible(false);
        setSelectedCompany(null);
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
                    // Fallback to a web browser if no navigation app is available
                    console.log("No navigation app available, opening in browser");
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
                }
            }).catch(() => {
                // Handle other errors related to Linking.canOpenURL
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
        const url = `https://api.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(text)}`;
        Linking.openURL(url);
        setIsModalVisible(false);
        setSelectedCompany(null);
    };

    const handleListItemPress = (company) => {
        setSelectedCompany(company);
        setIsModalVisible(true);
    };

    const onFavoritePress = (company) => {
        // Handle list item press action if needed
        console.log('Company pressed:', company);
    };

    return (
        <ContentContainer>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('favorites')}</Text>
                </View>

                {isLoading && (
                    <LoadingComponent />
                )}

                {!companies && !isLoading && (
                    <View style={styles.emptyContainer}>
                        <Icon name="frown-o" size={50} color="#0C5298" />
                        <Text style={styles.emptyText}>{t('noFavorites')}</Text>
                    </View>
                )}

                {companies && !isLoading && (
                    <>
                        <FlatList
                            data={companies}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <CompanyListItem
                                    company={item}
                                    onPress={handleListItemPress}
                                    userLocation={userLocation}
                                    onFavoritePress={onFavoritePress}
                                />
                            )}
                        />
                    </>
                )}


            </View>

            <CompanyModal
                isVisible={isModalVisible}
                company={selectedCompany}
                onClose={closeModal}
                onStartNavigation={onStartNavigation}
                onOpenWhatsApp={onOpenWhatsApp}
                onFavoritePress={onFavoritePress}
                isFavorited={true}
                isLoadingOnModal={isLoadingOnModal}
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
        paddingHorizontal: 25
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#0C5298"
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

export default HomeScreen;
