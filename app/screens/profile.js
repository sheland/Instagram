import React from 'react';
import { Flatlist, StyleSheet, Text, View, Image } from 'react-native';

class profile extends React.Component{

  constructor(props) {
    super(props);
  }

  render()
  {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Profile</Text>
      </View>
    )
  }

}

export default profile;
