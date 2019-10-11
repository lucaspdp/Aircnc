import React, {useState, useEffect} from 'react'
import { View, 
    AsyncStorage, 
    Text ,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native'
import {withNavigation} from 'react-navigation'
import socketio from 'socket.io-client'

import logo from '../../assets/logo.png'
import SpotList from '../components/SpotList'

function List({navigation}){
    const [techs, setTechs] = useState([]);

    useEffect(()=>{
            AsyncStorage.getItem('user').then(user_id=>{
                const socket = socketio('http://192.168.0.9:3333',{
                    query: { user_id }
                })
                
                socket.on('booking_response', booking=>{
                    Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA': 'REJEITADA'}`)
                })
            });
    },[])

    useEffect(()=>{
        AsyncStorage.getItem('techs').then(storagedTechs=>{
            const techsArray = storagedTechs.split(',').map(tech=>tech.trim());

            setTechs(techsArray);
        })
    }, []);

    async function handleQuit(){
        await AsyncStorage.removeItem('user')
        navigation.navigate('Login')
    }

    return <SafeAreaView style={styles.container}>
        <View>
            <Image style={styles.logo} source={logo} />
            <TouchableOpacity style={styles.quit} onPress={handleQuit}>
                <Text style={styles.quitText}>Sair</Text>
            </TouchableOpacity>
        </View>
        
        <ScrollView>
            {techs.map(tech=>(
                <SpotList tech={tech} key={tech}/>
            ))}
        </ScrollView>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    logo:{
        height: 32,
        resizeMode: "contain",
        alignSelf: 'center',
        marginTop: 40
    },
    quit: {
        position: 'absolute',
        marginTop: 35,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderColor: '#ff3535',
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: '5%',
        alignItems: "center",
        justifyContent: 'center'
    },
    quitText: {
        color: '#ff3535',
        fontWeight: 'bold'
    }
});

export default withNavigation(List)