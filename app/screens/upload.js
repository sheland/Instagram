import React from 'react';
import { TextInput, ActivityIndicator, TouchableOpacity, Flatlist, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import { Permissions, ImagePicker } from 'expo';

class upload extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: ''
    }
  }

  //async means wait! need to wait for results
  //check permission for camara & camara roll
  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({camara:status});

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({camaraRoll:statusRoll});
  }
  //return collection of random letters and #'s to create unique id
  //example '5a50'
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }

  //return sequence of s4()
  uniqueId = () => {
    return (
      this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4()
    );
  };

  //ask for permission
  //call to select image
  //options=> 'images'(won't upload videos etc), 'allowsEditing': can crop pics etc, 'quality': specify quality of compression, 1 means compress for maximum quality.

  //console.log(result)->
  //Object{
  //"cancelled": false,
  //"height": 750,
  //"type": "image",
  //"uri" "long ass link",
  //"width": 1125
  //}
  findNewImage = async () => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("upload image");
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri
      });
      //this.uploadImage(result.uri);
    } else {
      console.log("cancel");
      this.setState({
        imageSelected: false
      });
    }
  };

  //check extension type of image
  //re-> looks for last "." and pass the word after the '.' ex: "filename.png"
  //ext -> grabs 2nd part of array

  //convert image.uri to blob to upload to firebase storage
  //ref: reference to firebase storage

  //var snapshot-> make call to firebase storage to upload image
    //state_changed-> listen to upload
  uploadImage = async (uri) => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({currentFileType: ext});

    // const response = await fetch(uri);
    // const blob = await response.blob();
    var FilePath = imageId+'.'+that.state.currentFileType;

    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      //Call function to complete upload with the new blob to handle the uploadTask
      this.completeUploadBlob(blob, FilePath);
    };
    oReq.send();
    // const ref = storage.ref('user/'+userid+'/img').child(FilePath);

    var snapshot = ref.put(blob).on('state_changed', snapshot => {
      console.log('Progress!', snapshot.bytesTransferred, snapshot.totalBytes)
    });

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
      <View style={{flex: 1}}>
        { this.state.loggedin == true ? (
          //logged in
          <View style={{flex: 1}}>
          { this.state.imageSelected == true ? (
            <View style={{flex: 1}}>
              <View style={{height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: '#D0D0D0', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Upload</Text>
              </View>
              <View style={{padding: 5}}>
                <Text style={{marginTop: 5}}>Caption:</Text>
                <TextInput
                  editable={true}
                  placeholder={'Enter your caption..'}
                  maxLength={150}
                  multiline={true}
                  numberofLife={4}
                  onChangeText={(text) => this.setState({caption: text})}
                  style={{marginVertical: 10, height: 100, padding: 5, borderColor: 'grey', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black'}}
                />
              </View>
          </View>
          ) : (

            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 28, paddingBottom: 15}}>Upload</Text>
            <TouchableOpacity
            onPress={ () => this.findNewImage()}
            style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5}}>
            <Text style={{color: 'white'}}>Select Photo</Text>
            </TouchableOpacity>
            </View>
            )}
          </View>
        ) : (
          //not logged in
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Login to upload a pic!</Text>
          </View>
        )}
      </View>
    )
  }

}

export default upload;
