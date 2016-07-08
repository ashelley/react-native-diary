// Navigation
import React, { Component } from 'react';
import ReactNative from 'react-native'

const {
  View,
  Text,
  StatusBar,
  NavigationExperimental: Navigation,
  TouchableOpacity,
} = ReactNative

import LoginScreen from './LoginScreen'
import TaskLists from './TaskLists'

const {
  CardStack: NavCardStack,
  StateUtils: NavStateUtils,
  Header: NavHeader,
} = Navigation

const reduceNavState = (navState, action) => {
  const {type, key} = action;
  switch (type) {
    case 'push':
      const route = {key}
      return NavStateUtils.push(navState, route)
    case 'pop':
      return NavStateUtils.pop(navState)
    default:
      return navState
  }
}

const renderHeaderRight = (sceneProps) => {
  const routeKey = sceneProps.scene.route.key
  let buttonText = ''
  // TODO this logic should go into individual screens, right?
  if (routeKey.startsWith('task_list')) {
    buttonText = 'Add'
  } else if (routeKey.startsWith('edit_task')) {
    buttonText = 'Save'
  }
  return (
    <TouchableOpacity style={{flex: 1, justifyContent:'center', alignItems: 'center', padding: 15}}>
      <Text>{buttonText}</Text>
    </TouchableOpacity>
  )
}

const Header = ({...sceneProps, goBack}) => (
  <NavHeader
    {...sceneProps}
    renderTitleComponent={() => (<NavHeader.Title>Todo Wonder</NavHeader.Title>)}
    renderRightComponent={renderHeaderRight.bind(null, sceneProps)}
    onNavigateBack={goBack}
    />
)

class TWNavigator extends Component {
  constructor(props, context) {
    super(props, context)
    this._renderScene = this._renderScene.bind(this)
    this._renderHeader = this._renderHeader.bind(this)
    this._goBack = this._navigate.bind(this, null, 'pop')
    this.state = {
      navigation: {
        index: 0,
        routes: [{key: 'task_list', tabIndex: 0, }],
      },
    }
  }
  render() {
    return (
      <NavCardStack
        renderScene={this._renderScene}
        renderOverlay={this._renderHeader}
        navigationState={this.state.navigation}
        onNavigateBack={this._goBack}
        />
    )
  }
  _renderHeader(sceneProps) {
    return (
      <Header {...sceneProps} goBack={this._goBack}/>
    )
  }
  _renderScene(sceneProps) {
    const routeKey = sceneProps.scene.route.key
    switch (routeKey) {
      case 'login_screen':
        return <LoginScreen {...sceneProps} />
      case 'task_list':
        const tabIndex = sceneProps.scene.route.tabIndex || 0
        return (
          <TaskLists {...sceneProps} activeTabIndex={tabIndex}
            navigationState={this.state.navigation}
            onNavigate={this._navigate.bind(this)}/>
        )
      default:
        return <Text>Unknown route: {routeKey}</Text>
    }
  }
  _navigate(reducer, action) {
    const newNavState = (reducer || reduceNavState)(this.state.navigation, action)
    if (newNavState !== this.state.navigation) {
      this.setState({
        navigation: newNavState,
      })
    }
  }
}

module.exports = TWNavigator
