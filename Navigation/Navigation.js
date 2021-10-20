// Navigation/Navigation.js
// import { createStackNavigator  } from 'react-navigation-stack'
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'
import Favorites from '../Components/Favorites'
import FilmList from '../Components/FilmList'
import Test from '../Components/Test'
import News from '../Components/News'
import Seen from '../Components/Seen'
const SearchStackNavigator = createStackNavigator({
  Search: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
    screen: Search,
    navigationOptions: {
      title: 'Rechercher'
    }
  },

  FilmDetail: {
    screen: FilmDetail,
    navigationOptions: {
      title: 'Details du film '
    }
  }
})

const FavoritesStackNavigator = createStackNavigator({
  Favorites: {
    screen: Favorites,
    navigationOptions: {
      title: 'La liste des films favorits'
    }
    },
    FilmDetail: {
      screen: FilmDetail,
      navigationOptions: {
        title: 'Details du film '
      }
    }
})
const NewsStackNavigator = createStackNavigator({
  News: {
    screen: News,
    navigationOptions: {
      title: 'La liste des nouveaux films'
    }
    },
    FilmDetail: {
      screen: FilmDetail
    }
  
})

const SeenStackNavigator = createStackNavigator({
  Seen: {
    screen: Seen,
    navigationOptions: {
      title: 'La liste des films déjà vu'
    }
    },
    FilmDetail: {
      screen: FilmDetail
    }
  
})
const MoviesTabNavigator = createBottomTabNavigator({


  Search: {
    screen: SearchStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image
          source={require('../Images/ic_search.png')}
          style={styles.icon}
        />
      }
    }
  },
  Favorites: {
    screen: FavoritesStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image
          source={require('../Images/ic_favorite.png')}
          style={styles.icon}
        />
      }
    }
  },
  News: {
    screen: NewsStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image
          source={require('../Images/ic_fiber_new.png')}
          style={styles.icon}
        />
      }
    }
  },
  Seen: {
    screen: SeenStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image
          source={require('../Images/seen.png')}
          style={styles.icon}
        />
      }
    }
  }
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeBackgroundColor: '#DDDDDD',
    inactiveBackgroundColor: '#FFFFFF'
  }

}

)


const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  }
})
export default createAppContainer(MoviesTabNavigator)