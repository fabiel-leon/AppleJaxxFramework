import React, {Component} from 'react'
import { Provider } from 'react-redux'

import { registerScreens } from './util/registerScreens';
import { resolveIconsFromFrame } from './util/resolveIconsFromFrame';
import configureStore from './configureStore';
import { Navigation } from 'react-native-navigation';
import frame from './frame/frame.json';
import getValue from './util/getValue';
import resolveBindings from './util/resolveBindings';
import { addIconSources } from './actions/icons'
import { updateFrame } from './actions/frameActions'
import { setInitialBindings } from './actions/bindingActions'
import { updateGeolocation } from './actions/geolocationActions'
let store = configureStore();

// frame = resolveBindings(frame);

registerScreens(store, Provider, frame);

//Initial Frame
store.dispatch(updateFrame(frame));
store.dispatch(setInitialBindings(frame.bindings));

//Initial geolocation
navigator.geolocation.getCurrentPosition(
   (position) => {
      var initialPosition = JSON.stringify(position);
      store.dispatch(updateGeolocation(position));
   },
   (error) => alert(error.message),
   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
);
//Initial Icons resolved into image form
resolveIconsFromFrame(frame).then((icons) => {
  startApp(frame, icons);
}).catch((error) => {
  console.error(error);
});

//******** DRAWER TYPE ***********
// drawer: {
//     type: "MMDrawer",
//     animationType: 'door',
//     animationType: 'parallax',  // I like this one
//     animationType: 'slide',  // Default
//     animationType: 'slide-and-scale',
//     type: "TheSideBar",
//     animationType: 'airbnb',
//     animationType: 'facebook',
//     animationType: 'luvocracy',
//     animationType: 'wunder-list',  // A more subtle parallax
//     left: {
//       screen: 'example.SideMenu',
//     }
//   }

// ******* SCREEN ****************
// label: 'Two',
// screen: 'example.SecondTabScreen',
// icon: require('../img/two.png'),
// selectedIcon: require('../img/two_selected.png'),
// title: 'Screen Two',
// navigatorStyle: {
//   tabBarBackgroundColor: '#4dbce9',
// }

// ******* PARAMS ****************
// tabs: [],
// tabsStyle: {},
// drawer: {
//            left: {
//                screen: {SCREEN}
//            },
//            right: {
//                screen: {SCREEN}
//            },
//            animationType: ["slide", "door", "parallax", "slide-and-scale"],
//            type: "MMDrawer",
//            style: {
//                 "leftDrawerWidth": 50, //percents
//                 "rightDrawerWidth": 50, //percents
//                 "contentOverlayColor": "#BBB", //color
//                 "drawerShadow": false
//            },
//            disableOpenGesture: ?
//         },
// subtitle: '',
// passProps: {}

// ******* APP Types ****************
// Navigation.startSingleScreenApp({
//   screen: {SCREEN}
// });

// Navigation.startTabBasedApp([{SCREEN}]);

function startApp(frame, icons) {
  //map titles & styles to keys
  store.dispatch(addIconSources(icons));

  let pages = {};
  _.each(frame.pages, (page) => {
    pages[page.key] = page;
  });

  const keys = _.map(frame.pages, page => page.key);
  const footerTabs = getValue(frame, "footer.tabs")

  let drawer = getValue(frame, "drawer")
  if(drawer.left)
    drawer.left.passProps = pages[getValue(drawer, "left.screen")];

  if(drawer.right)
    drawer.right.passProps = pages[getValue(drawer, "right.screen")];


  if(footerTabs) {
    let tabs = [];
    _.each(footerTabs, (tab) => {
      const page = pages[tab.screen];
      let node = {
        label: tab.label,
        screen: tab.screen,
        icon: icons[tab.icon],
        title: page.title,
        subtitle: page.subtitle,
        navigatorStyle: page.navigatorStyle
      };
      tabs.push(node);
    });
    Navigation.startTabBasedApp({tabs: tabs, tabStyles: getValue(frame, "footer.style"), drawer: drawer});
  }else {
    let screen = {
      title: frame.pages[0].title,
      screen: frame.pages[0].key,
      subtitle: frame.pages[0].subtitle,
      navigatorStyle: frame.pages[0].navigatorStyle
    }
    Navigation.startSingleScreenApp({screen, drawer: drawer});
  }
}
