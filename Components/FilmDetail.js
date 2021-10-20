import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Image, Platform, Share, Button } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    onPress={() => params.shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>

            }
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            film: [],
            isLoading: false
        }
        this._toggleFavorite = this._toggleFavorite.bind(this)
        this._shareFilm = this._shareFilm.bind(this)
    }
    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview })
    }

    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }


    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.getParam('idFilm'))
        if (favoriteFilmIndex !== -1) {
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            }, () => { this._updateNavigationParams() })
            return
        }
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.getParam('idFilm')).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => { this._updateNavigationParams() })
        })
    }




    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }
    _toggleSeen() {
        const action = { type : "TOGGLE_SEEN", value : this.state.film}
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log(this.props.favoritesFilm);
    }

    _displayFavoriteImage() {
        var sourceImage = require('../Images/ic_favorite_border.png')
        var shouldEnlarge = false 
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {

            sourceImage = require('../Images/ic_favorite.png')
            shouldEnlarge = true
        }
        return (
            <EnlargeShrink
            shouldEnlarge= {shouldEnlarge}>
            <Image
                source={sourceImage}
                style={styles.favorite_image}
            />
            </EnlargeShrink>
        )
    }

    _displaySeenButton() {
        if (this.props.seenFilms.findIndex(item => item.id === this.state.film.id) !== -1) {
          return (
            <Button
              title='Non vu'
              onPress={() => this._toggleSeen()}/>
          )
        }
        return (
          <Button
            title='Marquer comme vu'
            onPress={() => this._toggleSeen()}/>
        )
      }


    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            )
        }
    }





    _displayFilm() {
        const { film } = this.state
        if (film != undefined) {
            return (
                //<View style={styles.main_container}>

                <ScrollView style={styles.scrollview_container}>

                    <Image style={styles.image_container}
                        source={{ uri: getImageFromApi(this.state.film.poster_path) }}

                    />
                    <Text style={styles.title_container}> {film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.overview_container}> {film.overview}</Text>
                    <Text style={styles.details_container}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.details_container}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.details_container}>Nombre de votes : {film.vote_count}</Text>
                    

                    {this._displaySeenButton()}
                </ScrollView>
                // </View>

            )
        }
    }



    render() {
        console.log(this.props)
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
                {this._displayFloatingActionButton()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image_container: {
        margin: 5,
        height: 180,
        // backgroundColor: 'pink'
    },
    title_container: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        //backgroundColor: 'lightgreen',
        textAlign: 'center'
    },
    overview_container: {
        //flex: 2.5,
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 10
        //backgroundColor: 'red'
    },
    details_container: {
        //flex: 2,
        //marginBottom: 15,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        //backgroundColor: 'lightgray'
    },

    favorite_container: {
        alignItems: "center"
    },
    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
    }


})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.toggleFavorite.favoritesFilm,
        seenFilms : state.toggleSeen.seenFilms
    }
}


export default connect(mapStateToProps)(FilmDetail)