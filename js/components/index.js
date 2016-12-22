import React, { Component } from 'react';
import Button from './button/button';
import Text from './text/text';
import { View } from 'react-native';

const components = {
  "button": Button,
  "text": Text,
  "thumbnail": Text
};


export default class BaseComponent extends Component {

  static propTypes = {
    type: React.PropTypes.string,
    onButtonPress: React.PropTypes.func
  }

  render() { // eslint-disable-line class-methods-use-this

    let Instance = components[this.props.type];
    return (
          <View >
              <Instance onButtonPress={this.props.onButtonPress} {...this.props}/>
          </View>
    );
  }
}
