import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

class feed extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      photoFeed: [],
      refresh: false,
      loading: true
    }
  }
  //executes when application is opening
  componentDidMount = () => {

    //loads feed from DB
    this.loadFeed();
  }

  loadFeed = () => {
    this.setState({
      refresh: true,
      photoFeed: [],

    });

    //when making calls to DB, this cannot be accessed
    var that = this;

    //fetch photos from firebase database
    //by posted date order, fetch data once
    //result of query = snapshot

    //check if photos were found in database by checking the value of snapshot
    //if photos exist, save in variable
    database.ref('photos').orderByChild('posted').once('value').then(function(snapshot) {
      const exists = (snapshot.val() !== null);
      if(exists) data = snapshot.val();
        var photoFeed = that.state.photoFeed;

        //define each element in data as 'photo'
        //'photo' => photo-id

        //make database call to access user's info by photo-id


        for(var photo in data){
            var photoObj = data[photo];

              database.ref('users').child(photoObj.author).child('username').once('value').then(function(snapshot) {
                const exists = (snapshot.val() !== null);
                if(exists) data = snapshot.val();
                  photoFeed.push({
                    id: photo,
                    url: photoObj.url,
                    caption: photoObj.caption,
                    posted: that.timeConverter(photoObj.posted),
                    author: data,
                    authorId: photoObj.author
                  });

                  that.setState({
                    refresh: false,
                    loading: false
                  });
              }).catch(error => console.log(error));
        }
    }).catch(error => console.log(error));

  }

  //add 's' to time
  //'one second ago '
  pluralCheck = (s) => {
    if(s === 1){
      return ' ago';
    }else{
      return 's ago';
    }
  }

  //timestamp => JS date format => seconds
  //seconds = today's date - timestamp's date
  timeConverter = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000);

    //year = seconds/seconds in 1 year
    var interval = Math.floor(seconds /31536000);
    if(interval > 1){
      return interval + ' year' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds /2592000);
    if(interval > 1){
      return interval + 'month' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds /86400);
    if(interval > 1){
      return interval + 'day' + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds /3600);
    if(interval > 1){
      return interval + 'hour' + this.pluralCheck(interval);
    }

    interval = Math.floor(seconds /60);
    if(interval > 1){
      return interval + 'minute' + this.pluralCheck(interval);
    }
    return Math.floor(seconds) + 'second' + this.pluralCheck(seconds);
  }

  //fetches new items from DB
  loadNew = () => {
    //loads feed
    this.loadFeed();
  }
  render()
  {
    return(
      <View style={{flex: 1}}>

        <View style={{height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: '#D0D0D0', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Feed</Text>
        </View>

        { this.state.loading == true ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Loading...</Text>
          </View>
        ) : (
        <FlatList
          refreshing={this.state.refresh}
          onRefresh={this.loadNew}
          data={this.state.photoFeed}
          keyExtractor={(item, index) => index.toString()}
          style={{flex: 1, backgroundColor: '#eee'}}
          renderItem={({item, index}) => (
            <View key={index}
              style={{width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
              <View style={{padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{item.posted}</Text>
                <TouchableOpacity
                onPress={ () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                  <Text>{item.author}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Image
                  source={{uri: item.url }}
                  style={{resizeMode: 'cover', width: '100%', height: 275 }}
                  />
              </View>
              <View style={{padding: 5}}>
                <Text>{item.caption}</Text>
                <Text style={{ marginTop: 10, textAlign: 'center'}}>View Comments</Text>
              </View>
            </View>
          )}
          />
        )}
      </View>
    )
  }

}

export default feed;
