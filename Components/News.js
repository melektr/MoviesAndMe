import React from 'react'
import { View, Text} from 'react-native'
import { getLatestFilmsFromApi } from '../API/TMDBApi'
import FilmList from './FilmList'

class News extends React.Component {


    constructor(props) {
        super(props)
        this.page = 0
        this.totalPages = 0
        this.state = {
            films: [],
            isLoading: false
        }
        this._loadFilms = this._loadFilms.bind(this)
    }

    componentDidMount() {
        this._loadFilms()
    }

    _loadFilms() {
        getLatestFilmsFromApi(this.page+1).then(data => {
            this.page = data.page
            this.totalPages = data.total_pages
            this.setState({
                films: [ ...this.state.films, ...data.results ],
                isLoading: false
            })
        })
    }

    render(){
    return(
        <FilmList
            films= {this.state.films}
            navigation={this.props.navigation}
            loadFilms = {this._loadFilms}
            page= {this.page}
            totalPages={this.totalPages}
            favoriteList={false}
            />
    )
    }
    
}

export default News