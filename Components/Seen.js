import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FilmSeenItem from './FilmSeenItem'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'

class Seen extends React.Component {


    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', { idFilm: idFilm })
    }

    render() {
        return (
            <FlatList
                style={styles.list}
                 data={this.props.seenFilms}
                keyExtractor= { (item ) => item.id.toString()}
                renderItem = { ( {item }) => (
                    <FilmSeenItem
                        film={item}
                        displayDetailForFilm={this._displayDetailForFilm}
                    />
                )}
            />
        )
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
})

const mapStateToProps = state => {
    return {
        seenFilms: state.toggleSeen.seenFilms
    }
}


export default connect(mapStateToProps)(Seen)