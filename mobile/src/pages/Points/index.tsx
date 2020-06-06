import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Emoji from 'react-native-emoji';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../services/api';
import styles from './styles';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
    // items: {
    //     title: string;
    // }[];
}

interface Params {
    uf: string;
    city: string;
}

const Points = () => {
    const route  = useRoute();
    const navigator = useNavigation();
    const routeParams = route.params as Params;
    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    function handleNavigateBack() {
        navigator.goBack();
    }
    function handleNavigateToDetail(id: number) {
        navigator.navigate("Detail", {id});
    }

    function handleSelectItem(id :number){
        if(selectedItems.includes(id)){
            setSelectedItems(selectedItems.filter(item=> item !== id));
        }else{
            setSelectedItems([...selectedItems, id]);
        }
    }

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        api.get('points', {
            params :{
            city: routeParams.city,
            uf: routeParams.uf,
            items: selectedItems,
        }}).then(response =>
            setPoints(response.data)
        )
    }, [selectedItems]);

    useEffect(() => {
        async function loadPosition(){
            const {status} = await Location.requestPermissionsAsync();

            if(status !== 'granted'){
                Alert.alert("ops... :astonished:", "Precisamos de sua permissão para obter a localização!");
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;
            console.log(latitude , longitude);
            setInitialPosition([
                latitude,
                longitude
            ]);
        }
        loadPosition();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Feather name="arrow-left" size={20} color={"#34cb79"} />
                </TouchableOpacity>
                <Text style={styles.title}><Emoji name="smiley" /> Bem-vindo.</Text>
                <Text style={styles.description}>Encrontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {   initialPosition[0] !== 0 && (
                        <MapView style={styles.map}
                        initialRegion={{
                            latitude: initialPosition[0],
                            longitude: initialPosition[1],
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014,
                        }}>
                        {points.map(point => {
                            <Marker style={styles.mapMarker}
                            key={String(point.id)}
                            onPress={()=>handleNavigateToDetail(point.id)}
                            coordinate={{
                                latitude: point.latitude,
                                longitude: point.longitude,
                            }}
                            >
                                <View style={styles.mapMarkerContainer} >
                                    <Image  style={styles.mapMarkerImage}
                                        source={{ uri: point.image_url }} />
                                    <Text style={styles.mapMarkerTitle} > point.name </Text>
                                </View>
    
                            </Marker>
                        })}

                    </MapView>
                    )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }} >
                    {items.map(item => (
                        <TouchableOpacity key={String(item.id)} activeOpacity={0.6} style={[styles.item, selectedItems.includes(item.id)? styles.selectedItem: {}]} onPress={() => handleSelectItem(item.id)}>
                        <SvgUri width={42} height={42} uri={item.image_url} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

export default Points;