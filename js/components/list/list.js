import React, { Component } from 'react';
import { ListView} from 'react-native';
import { Spinner } from 'native-base'
import baseTheme from '../../themes/base-theme'
import SectionHeader from './sectionHeader';
import demoData from '../../../dataSources/demoDataSource';
import Row from './row';
import API from '../../util/api';
import {
  View,
  AlertIOS,
  StyleSheet
} from "react-native";
// import defaultStyles from './styles';

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      loading: true
    };

  }

  async _constructDataSource(url, binding) {
    console.log("Fetching ", url);

    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      console.log("Success", responseJson[binding]);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson[binding]),
        loading: false
      });
    } catch(error) {
      console.warn("Warning, couldn't find dataSource", error);
      this.setState({loading: false})
    }
  }

  componentWillMount() {
    // this._constructDataSource(this.props.dataSource.url, this.props.rowDataBinding);
  }

  _renderRow(data, sectionIds, rowIds, rowComponents, rowOnClickEval) {
    return <Row data={data} sectionIds={sectionIds} rowIds={rowIds} components={rowComponents} rowOnClickEval={rowOnClickEval}/>
  }

  render() {
    console.log("List Rendered")
    return (this.state.loading ?
      <Spinner theme={baseTheme}/> :
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data, sectionIds, rowIds) => this._renderRow(data, sectionIds, rowIds, this.props.rowComponents, this.props.rowOnClickEval)}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );

    //   <ListView
    //     style={styles.container}
    //     dataSource={this.state.dataSource}
    //     renderRow={(data) => <Row {...data} />}
    //     renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
    //     renderHeader={() => <Header />}
    //     renderFooter={() => <Footer />}
    //     renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
    //   />
  }
}

const styles = {
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#8E8E8E',
  }
}
