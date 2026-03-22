import axios from 'axios';
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Image, SafeAreaView, ScrollView, Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Alert, Platform } from 'react-native'

export default function LoginScreen() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const logo = require('../../assets/images/photo3.png');


 const universalAlert = (title, message) => {
  if (Platform.OS === 'web') {
    const text = message ? `${title}: ${message}` : title;
    window.alert(text);
  } else {
    Alert.alert(title, message);
  }
};

const handleLogin = async () => {
  console.log("Button clicked!"); 
  setIsLoading(true);
  
  try {
    //console.log("Sending request to Python server...");
    const Response_Py = await axios.post('https://myserver-ckaceug6c8h2cqdy.israelcentral-01.azurewebsites.net/login', {
      email: email,
      password: password
    });
    
    //console.log("Python Server Response:", Response_Py.data);

    if (Response_Py.data.success === true) {
      console.log("Success! Fetching message from Node server...");
      
      const Response_node = await axios.get('http://192.168.1.35:5000/get-message');
      
      const Msg = Response_node.data.toastMessage || Response_node.data.Message;
      universalAlert("הודעה", Msg);
    } else {
      universalAlert("שגיאה", "אימייל או סיסמה לא נכונים!");
    }
  } catch (error) {
    console.error("Full Error Details:", error);
    if (error.response) {
       universalAlert("שגיאה מהשרת", `קוד: ${error.response.status}`);
       
    } else if (error.request) {
       universalAlert("שגיאת רשת", "לא ניתן להתחבר לשרת. וודאי שאת מחוברת לאינטרנט ושהשרת עובד.");
    } else {
       universalAlert("שגיאה", error.message);
    }
  } finally {
    setIsLoading(false);
  }

};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        
        <View style={styles.logoWrapper}>
          <View style={styles.logoPlaceholder}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.formWrapper}>
          <Text style={styles.headerTitle}>Log in</Text>

          
          <View style={styles.inputGroup}>
            <Icon name="mail" size={18} color="#a0aec0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#a0aec0"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* שדה סיסמה */}
          <View style={styles.inputGroup}>
            <Icon name="lock" size={18} color="#a0aec0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a0aec0"
              secureTextEntry={!show}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeIcon}>
              <Icon name={show ? "eye" : "eye-off"} size={18} color="#adb5bd" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          {/* כפתור לוגין סגול ועגול */}
          <TouchableOpacity style={styles.loginBtn}
            onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Log in</Text>
          </TouchableOpacity>

          {/* קו מפריד "Or" */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

         {/* כפתורי סושיאל (מגוגל ופייסבוק) */}
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} 
                style={styles.socialIcon} 
              />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <Image 
               source={{ uri: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' }} 
                style={styles.socialIcon} 
              />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>Have no account yet?</Text>
          
          <TouchableOpacity style={styles.registerBtnFlat}>
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,

  },
 logo: {
    width: 80,  
    height: 80, 
  },
  formWrapper: {
    width: '100%',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 50,
    color: '#436297',
    fontSize: 22,
    fontWeight: '600',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 16,
    height: 40,
    width: '90%',
    alignSelf: 'center',
  
  },

  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    fontSize: 13,
    color: '#6366f1',
    marginBottom: 30,
  },
  loginBtn: {
    width: '95%',
    height: 50,
    backgroundColor: '#9ba3eb',
    borderRadius: 80, 
    alignSelf: 'center',
    alighItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginBtnText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',     
    alignItems: 'center',     
    justifyContent: 'center', 
    width: '100%',            
    marginBottom: 20,
  },

  dividerLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: 110,

  },
  dividerText: {
    marginHorizontal: 15,
    color: '#767a7e',
    fontSize: 12,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',     
    justifyContent: 'center', 
    width: '100%',            
    gap: 10,
    marginBottom: 30,
  },
  socialBtn: {
    width: 160,   
    height: 45,
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  socialIcon: {
    width: 19,
    height: 19,
    marginRight: 10,
    borderRadius: 30,
  },
  socialBtnText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#767a7e',
    marginBottom: 10,
  },
  registerBtnFlat: {
    width: '95%',
    height: 45,
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
});
