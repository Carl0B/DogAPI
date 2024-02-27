import React, { useState, useEffect } from 'react';
import {Text, View, Image, Button, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://dog.ceo/api/breeds/image/random';
const App = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {// Cargar la imagen almacenada al montar el componente
    loadStoredImage();
  }, []);

  const fetchImage = async () => {
    try {
      const response = await axios.get(API_URL);
      setImage(response.data.message);
      saveImage(response.data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChooseImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if (pickerResult.assets.length > 0 && pickerResult.assets[0].uri) {
      setImage(pickerResult.assets[0].uri);
      saveImage(pickerResult.assets[0].uri);
    }
  };

  const saveImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('dogImage', imageUri);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const loadStoredImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('dogImage');
      if (storedImage !== null) {
        setImage(storedImage);
      }
    } catch (error) {
      console.error('Error loading stored image:', error);
    }
  };

  const removeImage = async () => {
    try {
      await AsyncStorage.removeItem('dogImage');
      setImage(null);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotos de perritos (API)</Text>
      <View style={styles.containerImg}>
      {image ? (<Image style={styles.image} source={{ uri: image }} />) : (
        <Text>No se ha seleccionado ninguna imagen</Text>
      )}
      </View>

      <View style={styles.buttons}>
      <Button color='pink' title="Cambiar imagen" onPress={fetchImage}/>
      
      <View style={styles.buttonspace}>
      <Button color='orange' title="Seleccionar imagen de la galería" onPress={handleChooseImage} style={styles.buttonspaceUp}/>
      </View>

      <View style={styles.buttonspace}>
      {image && (<Button color='red' title="Eliminar" onPress={removeImage}/>)}
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(245, 250, 245, 0.8)',
    Button:50,
  },
  containerImg:{
    height: 300,
  },
  buttons:{
    top:50,
    bottom:25,
  },
  buttonspace:{
    paddingTop:15,
  },
  buttonspaceCamb:{
    borderRadius: 50,
  },
  buttonspaceUp:{
    paddingTop:15,
  },
  buttonspaceDel:{
    paddingTop:15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'gray',
    //fontFamily: 'Lobster',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 200,
    borderWidth:4,
    borderColor:'rgba(245, 245, 245, 0.5)',
    
  },
});

export default App;