import React from 'react';
import { TouchableOpacity, Flatlist, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

class profile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    }
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if(user){
        //Logged in
        that.setState({
          loggedin: true
        });
      }else{
        //Logged out
        that.setState({
          loggedin: false
        });
      }
    });
  }

  render()
  {
    return(
      <View style={{flex: 1 }}>
        { this.state.loggedin == true ? (
          //logged in
          <View style={{flex: 1 }}>
            <View style={{height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: '#D0D0D0', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Profile</Text>
            </View>
            <View style={{justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
              <Image source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png'}} style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50}} />
              <View style={{margineRight: 10}}>
                <Text>Name</Text>
                <Text>@username</Text>
                </View>
            </View>
            <View style={{paddingBottom: 20, borderBottomWidth: 1}}>
              <TouchableOpacity style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                <Text style={{ textAlign: 'center', color: 'grey' }}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                <Text style={{ textAlign: 'center', color: 'grey' }}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Upload')}
              style={{ backgroundColor: 'grey', marginTop: 10, marginHorizontal: 40, paddingVertical: 35, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Upload New +</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green'}}>
              <Text>Loading you pics!!!!</Text>
            </View>
          </View>
        ) : (
          //not logged in
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>You are not logged in</Text>
          </View>
        )}
      </View>
    )
  }

}

export default profile;
