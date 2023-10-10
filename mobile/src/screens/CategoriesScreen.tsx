import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ContentContainer from '../components/ContentContainer';
import { listCategories, deleteCategory } from '../services/CategoryService';
import { globalContentStyles } from '../styles/styles';
import { ITEMS_PER_PAGE } from '@env';
import CustomModal from '../components/CustomModal';
import ViewItemComponent from '../components/ViewItemComponent';
import EditItemComponent from '../components/EditItemComponent';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const CategoriesScreen = () => {
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = ITEMS_PER_PAGE; // Change this value to set the number of items per page
    const [noResults, setNoResults] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await listCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleDeleteCategory = useCallback((categoryId) => {
        setCategoryToDelete(categoryId);
        setDeleteModalVisible(true);
    }, []);

    const handleViewItem = (item) => {
        setSelectedItem(item);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleUpdateItem = () => {

    }

    const confirmDeleteCategory = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete)
                .then(() => {
                    setCategories((prevCategories) =>
                        prevCategories.filter((category) => category.id !== categoryToDelete)
                    );
                })
                .catch((error) => {
                    console.error('Error deleting category:', error);
                })
                .finally(() => {
                    setCategoryToDelete(null);
                    setDeleteModalVisible(false);
                });
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const listHeader = (
        <View style={globalContentStyles.listHeader}>
            <Text style={globalContentStyles.listHeaderText}>Categorias</Text>
        </View>
    );

    const renderNoResultsMessage = () => {
        if (filteredCategories.length === 0 && searchText !== '') {
            return (
                <Text style={styles.noResultsText}>
                    No results found for "{searchText}".
                </Text>
            );
        }
        return null;
    };

    return (
        <ContentContainer>
            <View style={styles.searchBarContainer}>
                <Icon name="search" size={18} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar"
                    placeholderTextColor="#0C5298"
                    onChangeText={(text) => {
                        setSearchText(text);
                        setCurrentPage(1); // Reset page when searching
                        setNoResults(false);
                    }}
                    value={searchText}
                />
            </View>
            <FlatList
                data={currentItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={globalContentStyles.categoryItem}>
                        <Text>{item.name}</Text>
                        <View style={styles.buttonContainer}>
                            <ActionIcon name="eye" color="#3d84a8" onPress={() => handleViewItem(item)} />
                            <ActionIcon name="pencil" color="orange" onPress={() => handleEditItem(item)} />
                            <ActionIcon
                                name="trash"
                                color="red"
                                onPress={() => handleDeleteCategory(item.id)}
                            />
                        </View>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={listHeader}
                style={globalContentStyles.flatList}
            />
            {renderNoResultsMessage()}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <CustomModal
                isVisible={isDeleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeleteCategory}
                message="Are you sure you want to delete this category?"
            />
            {selectedItem && (
                <ViewItemComponent
                    item={selectedItem}
                    isVisible={selectedItem !== null}
                    onClose={() => setSelectedItem(null)}
                />
            )}
            {editingItem && (
                <EditItemComponent
                    item={editingItem}
                    isVisible={editingItem !== null}
                    onSave={handleUpdateItem}
                    onCancel={() => setEditingItem(null)}
                />
            )}
        </ContentContainer>
    );
};

const ActionIcon = ({ name, color, onPress }) => (
    <TouchableOpacity style={globalContentStyles.iconButton} onPress={onPress}>
        <FontAwesome name={name} size={24} color={color} />
    </TouchableOpacity>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <View style={styles.pagination}>
        {currentPage > 1 && (
            <TouchableOpacity onPress={() => onPageChange(currentPage - 1)}>
                <Icon name="chevron-left" size={24} color="#3d84a8" />
            </TouchableOpacity>
        )}
        <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
        </Text>
        {currentPage < totalPages && (
            <TouchableOpacity onPress={() => onPageChange(currentPage + 1)}>
                <Icon name="chevron-right" size={24} color="#3d84a8" />
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'aliceblue',
        color: '#0C5298',
        borderRadius: 15,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 10,
        color: '#0C5298',
    },
    searchBar: {
        flex: 1, // Take remaining space

    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    paginationText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#3d84a8',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        color: 'red',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    modalButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CategoriesScreen;
