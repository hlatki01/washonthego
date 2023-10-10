// styles.js or styles.ts
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00293f',
        padding: 25

    },
    logo: {
        margin: 150,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '80%',
        height: 50,
        marginBottom: 10,
        borderRadius: 5,
        padding: 15,
        backgroundColor: 'aliceblue',
        color: '#0C5298',
    },
    passwordInput: {
        width: '80%',
        height: 50,
        marginBottom: 10,
        padding: 15,
        backgroundColor: 'aliceblue',
        color: '#0C5298',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordTextInput: {
        flex: 1,
    },
    eyeIcon: {
        width: 24,
        height: 24,
        color: '#0C5298',
    },
    button: {
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#3d84a8'
    },
    registerButtonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff'
    },
    primaryButton: {
        backgroundColor: '#fff', // Updated primary color
        margin: 5
    },
    secondaryButton: {
        margin: 5,

    },
    registerButton: {
        margin: 5,
        backgroundColor: '#3d84a8', // Updated primary color

    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    placeholderText: {
        color: '#3d84a8'
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        width: '80%'
    },

});

const globalContentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',

    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    iconButton: {
        marginLeft: 10,
    },
    tableContainer: { flex: 1, backgroundColor: 'white', margin: 10, borderRadius: 10 },
    tableHeader: { height: 40, backgroundColor: '#f1f8ff' }, // Header style
    tableHeaderText: { margin: 6, fontWeight: 'bold', textAlign: 'center' }, // Header text style
    tableText: { margin: 6, textAlign: 'center' }, // Table cell text style
    categoryItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listHeader: {
        padding: 10
    },
    listHeaderText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#0C5298'
    },
    listFooter: {
        backgroundColor: 'rgb(249 249 249)',
        borderTopWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
    listFooterText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    flatList: {
        borderColor: 'gray',
    },
});

export { globalStyles, globalContentStyles };
