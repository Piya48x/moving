import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';

const FollowDriver = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="คนขับกำลังมารับพัสดุ"
          subtitle="ชื่อ: John | นามสกุล: Doe | ประเภทรถ: Sedan"
          left={(props) => <Avatar.Image {...props} source={require('../image/k.webp')} />}
        />
        <Card.Content>
          <Text>ทะเบียนรถ: 123-456 | สีรถ: ดำ</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
  },
});

export default FollowDriver;
