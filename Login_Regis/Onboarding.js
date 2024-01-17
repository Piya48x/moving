import React from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import * as Animatable from "react-native-animatable";

const { height, width } = Dimensions.get("screen");

class Onboarding extends React.Component {
  componentDidMount() {
    // Set a timeout to automatically navigate to the next screen after 10 seconds
    setTimeout(() => {
      this.props.navigation.navigate("Login");
    }, 5000);
  }

  render() {
    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
        </Block>
        <Block center>
          <Animatable.Image
            animation="zoomIn" // You can use any animation from the library
            source={require("../image/a.jpg")}
            style={styles.logo}
          />
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block style={styles.title}>
              <Block>
                <Animatable.Text
                  animation="fadeInDown" // You can use any animation from the library
                  duration={1500} // Duration of the animation
                  delay={500} // Delay before the animation starts
                >
                  <Text color="black" size={60}>
                    Moving
                  </Text>
                </Animatable.Text>
              </Block>
              <Block>
                <Animatable.Text
                  animation="fadeInLeft"
                  duration={1500}
                  delay={1000}
                >
                  <Text color="black" size={60}>
                    For Items
                  </Text>
                </Animatable.Text>
              </Block>
              <Block style={styles.subTitle}>
                <Animatable.Text
                  animation="fadeInUp"
                  duration={1500}
                  delay={1500}
                  size={16}
                >
                  <Text color="black" size={16}>
                    ยินดีต้อนรับเข้าสู่บริการขนย้ายสิ่งของ
                  </Text>
                </Animatable.Text>
              </Block>
            </Block>
            <Block center>
              {/* <Button
                style={styles.button}
                //color={argonTheme.COLORS.SECONDARY}
                onPress={() => navigation.navigate("Login")}
                //textStyle={{ color: argonTheme.COLORS.BLACK }}
              >
                Get Started
              </Button> */}
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: 350,
    height: 250,
    zIndex: 2,
    position: "relative",
    top: -50,
    marginTop: "-50%",
    alignItems: "center",
  },
  
  title: {
    marginTop: "-5%",
  },
  subTitle: {
    marginTop: 20,
  },
});

export default Onboarding;
