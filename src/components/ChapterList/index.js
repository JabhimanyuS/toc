import React from 'react'

import './index.css'

class ChapterList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeChapterId: '',
            open: false
        }
    }

    // Sets currently viewed chapter ID
    setActiveChapterID = (id) => {
        this.setState({
            open: id === this.state.activeChapterId ? !this.state.open : true,
            activeChapterId: id
        })
    }

    // Calculates chapter completion percentage
    getCompletionPercent = (total, completed, chapterId) => {
        if (total && total[chapterId]) {
            return `${Math.round((completed.length / total[chapterId].length) * 100)}%`
        }
    }

    generateLessons = (results) => {
        const lessons = {}
        results.forEach((result) => {
            if (result) {
                let data = result.data.response
                Object.assign(lessons, data)
            }
        })
        return lessons
    }

    getLessonsList = (chapterId, lessons) => {
        if (lessons[chapterId]) {
            const lessonList = lessons[chapterId].map((lesson, index) => {
                return (
                    <div className="individual-lesson" key={lesson.id}>
                        <div key={lesson.id} className={'lesson-list'}>{lesson.title}</div>
                        <span className={`completion-status ${lesson.status === 'COMPLETE' ? 'complete' : null}`}></span>
                    </div>
                )
            })
            return lessonList
        } else {
            return (
                <h4>No lessons found.</h4>
            )
        }
    }

    render() {
        let lessons;
        let completedLessons;
        let activeChapterId = this.state.activeChapterId;
        let open = this.state.open;
        if (Object.keys(this.props.lessons).length > 0) {
            lessons = this.generateLessons(this.props.lessons)
        }
        const chapterList = this.props.chapters.map((chapter, index) => {
            if (lessons && lessons[chapter.id]) {
                completedLessons = lessons[chapter.id].filter((lesson, index) => {
                    return lesson.status === 'COMPLETE'
                })
            }

            return (
                <div className="chapter-list" key={chapter.id}>
                    <img className={`${chapter.id === activeChapterId && open ? 'active' : null}`}
                        src="../../icons/right-arrow.svg"
                        alt="caret"
                    />
                    <span className="percentage">{this.getCompletionPercent(lessons, completedLessons, chapter.id)}
                        <span> Progress</span>
                    </span>
                    <a href="#" className="chapter-title" onClick={() => this.setActiveChapterID(chapter.id)}>
                        {index + 1}. {chapter.title}
                    </a>
                    <div className={`lessons-wrapper ${chapter.id === activeChapterId && open ? 'active' : null}`}>
                        {this.getLessonsList(chapter.id, lessons)}
                    </div>
                </div>
            )
        })
        return (
            <div className="list-wrapper">
                {chapterList}
            </div>
        )
    }

}

export default ChapterList