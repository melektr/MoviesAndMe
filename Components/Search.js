import React from 'react'
import { StyleSheet, View,Button,TextInput, ColorPropType, TouchableOpacity,Text,FlatList, ActivityIndicator } from 'react-native'
import films from '../Helpers/filmsData'
import  FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { connect } from 'react-redux'
import FilmList from './FilmList'


class Search extends React.Component {

    constructor(props) {
        super(props)
        this.state = { films: [],
            isLoading: false
         }
         this.searchedText = ""
         this.page = 0
         this.totalPages = 0

         this._loadFilms = this._loadFilms.bind(this)
    }


    _loadFilms () {
        this.setState({isLoading : true})
        if (this.searchedText.length > 0 ) {
        getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
            this.page = data.page
            this.totalPages = data.total_pages
            this.setState({
            films: [...this.state.films, ...data.results],
            isLoading: false
             })
         })
    
        }

    }

    _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _displayLoading() {
        if(this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _searchFilms() {
        this.page = 0
        this.totalPages = 0
        this.setState({
            films: []
        }, () => {
            console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            this._loadFilms()
        })
        
    }


    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id" + ' ' + idFilm)
        this.props.navigation.navigate('FilmDetail', { idFilm : idFilm })
    }


    render() {
        
        return (
            <View style= {styles.main_container}> 
                <TextInput onSubmitEditing={() => this._searchFilms()} onChangeText={(text) => this._searchTextInputChanged(text)} style= {styles.textinput} placeholder = "Titre du film" />
                <TouchableOpacity style = {styles.button}  onPress={()=> this._searchFilms()}>
                    <Text style= {styles.text}>Rechercher</Text>
                   
                    </TouchableOpacity>
                    <FilmList
                      films = {this.state.films}
                      navigation = {this.props.navigation}
                      loadFilms = {this._loadFilms}
                      page={this.page}
                      totalPages= {this.totalPages}
                      favoriteList = {false}
                     />
                     {this._displayLoading()}
            </View>  
        )
    }
}

const styles =  StyleSheet.create({
    main_container: {
       
        flex: 1
        
    },
    text: {
        color: 'white',
        textAlign: "center",
        paddingTop: 10
    },
    textinput : {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#800080',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 5,
        backgroundColor : '#ffefd5'
    },
    button : {
       /* alignItems: 'center',
        justifyContent: 'center',*/
        borderRadius: 5,
        width: 100,
        height: 40,
        backgroundColor : '#db7093',
        marginLeft: 150,
        marginTop: 20 
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }

})



export default Search