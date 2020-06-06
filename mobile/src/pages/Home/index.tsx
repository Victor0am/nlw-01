import React, {useState, useEffect} from 'react';
import { View, Platform, Text, Image, ImageBackground, TextInput, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import styles from './styles';


// import { Container } from './styles';

const Home = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState("");
    const [city, setCity] = useState("");
    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            city, uf
        });
    }
    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'? 'padding': undefined}>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a UF"
                        value={uf}
                        maxLength={2}
                        autoCapitalize='characters'
                        autoCorrect={false}
                        onChangeText={setUf} />
                        
                    <TextInput style={styles.input}
                        placeholder="Digite a Cidade"
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity} />
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