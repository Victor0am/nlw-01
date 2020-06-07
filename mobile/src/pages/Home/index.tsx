import React, { useState, useEffect } from 'react';
import { View, Platform, Text, Image, ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import styles from './styles';
import { Picker } from '@react-native-community/picker'
import axios from 'axios';


// import { Container } from './styles';
interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const Home = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState("");
    const [city, setCity] = useState("");
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    function handleNavigateToPoints() {
        if(city === '' || uf === ''){
            alert("Preencha os campos!");
            return;
        }
        navigation.navigate('Points', {
            city, uf
        });
    }

    useEffect(()=> {
         axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
         .then(response => {
             console.log("AAAAAAAAAAA");
             const ufInitials = response.data.map(uf => uf.sigla);
             ufInitials.sort((uf1,uf2)=> uf1.localeCompare(uf2));
             setUfs(ufInitials);
         });

    }, []);

    useEffect(()=>{
        if(uf === ''){
            return;
        }

         axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
         .then(response => {
             const cityNames = response.data.map(city => city.nome);
             setCities(cityNames);
         });
    }, [uf]);


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                style={styles.container}
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title} >Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}> Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>
                <View style={styles.footer}>


                    <Picker
                        selectedValue={uf}
                        onValueChange={uf => setUf(String(uf))}
                        style={styles.input}
                        mode="dropdown"
                    >
                        <Picker.Item label="Escolha uma UF" value="" key={0}/>
                        {ufs.map((uf, index)=> {
                            return (<Picker.Item label={uf} value={uf} key={index+1}/>)
                        })}
                    </Picker>
                    <Picker
                        selectedValue={city}
                        onValueChange={city => setCity(String(city))}
                        style={styles.input}
                        mode="dropdown"
                    >
                        <Picker.Item label="Escolha uma cidade" value="" key={0}/>
                        {cities.map((city, index)=> {
                            return (<Picker.Item label={city} value={city} key={index+1}/>)
                        })}
                    </Picker>
                    <RectButton style={styles.button} onPress={() => handleNavigateToPoints()}>
                        <View style={styles.buttonIcon}>
                            <Feather name="arrow-right" color="#FFF" size={24} />
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>);

}

export default Home;