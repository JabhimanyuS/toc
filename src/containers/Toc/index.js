import React from 'react';
import axios from 'axios'
import ChapterList from '../../components/ChapterList'

import './index.css'

let promises = []

class Toc extends React.Component {
  constructor() {
    super()
    this.state = {
      chapters: [],
      lessons: {}
    }
  }

  componentDidMount() {
    this.fetchChapters()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.chapters.length && Object.keys(nextState.lessons).length > 0) {
      return true
    }
    return false
  }

  fetchChapters = () => {
    // Gets chapters related to a subject (Maths here)
    // After fetching chapters fetch lessons immediately
    axios.get('http://localhost:3001/api/book/maths').then((response) => {
      this.setState({
        chapters: response.data.response
      }, this.fetchLessons)
    })
      .catch((err) => {
        console.log('Something went wrong!!', err)
      })
  }

  fetchLessons = () => {
    const chapters = this.state.chapters
    for (let i = 0; i < chapters.length; i++) {
      promises.push(axios.get(`http://localhost:3001/api/book/maths/section/${chapters[i].id}`).catch(() => null))
    }

    // Wait for all promises to resolve
    // Update the lessons after successful operation
    axios.all(promises).then((results) => {
      this.setState({
        lessons: results
      })
    }).catch((err) => {
      console.log('Something went wrong!!', err)
    })
  }

  render() {
    return (
      <React.Fragment>
        <h2 className="table-of-content">Table of contents</h2>
        <ChapterList chapters={this.state.chapters} lessons={this.state.lessons} />
      </React.Fragment>
    )
  }
}

export default Toc;
