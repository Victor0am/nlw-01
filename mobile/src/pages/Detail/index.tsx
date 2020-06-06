import React, {useState, useEffect} from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Emoji from 'react-native-emoji';
import * as MailComposer from 'expo-mail-composer';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Params {
    id: number
}

interface Data {
    point: {
        image: string;
        image_url: string;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string;
    };
    items: {
        title: string;
    }[];
}

import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
const Detail = () => {
    const navigator = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;
    const [data, setData] = useState<Data>({} as Data);


    function handleNavigateBack() {
        navigator.goBack();
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.point.email],

        })
    }

    function handleWhatsapp(){
       Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}$text=Tenho intesesse sobre a coleta de resíduos`);
    }

    useEffect(()=>{
        api.get(`points/${routeParams.id}`).then(response=>
            setData(response.data)
            )
    }, [])

    if(!data.point) {
        return null;
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Feather name="arrow-left" size={20} color={"#34cb79"} />
                </TouchableOpacity>
                <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}> {data.items.map(item=>item.title)}</Text>

                <View style={styles.address} >
                    <Text style={styles.addressTitle}> Endereço</Text>
                    <Text style={styles.addressContent}> {data.point.city}, {data.point.uf} </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button}
                    onPress={() => handleWhatsapp()}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Whatsapp </Text>
                </RectButton>
                <RectButton style={styles.button}
                    onPress={() => handleComposeMail()}>
                    <Feather name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> E-mail </Text>
                </RectButton>
            </View>
        </SafeAreaView>

    )
}

export default Detail;