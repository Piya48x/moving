import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ExampleComponent = () => {
  const [status, setStatus] = useState('Online');

  const toggleStatus = () => {
    setStatus((prevStatus) => (prevStatus === 'Online' ? 'Offline' : 'Online'));
  };

  return (
    <View>
      <Text>Status: {status}</Text>
      <TouchableOpacity onPress={toggleStatus}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={status === 'Online' ? 'check-circle' : 'cancel'} size={24} color={status === 'Online' ? 'green' : 'red'} />
          <Text style={{ marginLeft: 8 }}>{status === 'Online' ? 'Go Offline' : 'Go Online'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExampleComponent;
