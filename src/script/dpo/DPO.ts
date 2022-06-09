import {Modal} from './modal'
import {Course, CourseStates, CourseWithState, DpoObject} from '../../types/dpo.types'

export class DPO {
    dpoCourses: DpoObject
    card: Course[] = []
    currentCourse: Course | CourseWithState
    currentCourseKey: string
    modal: Modal = new Modal()

    constructor(dpoObj: DpoObject) {
        this.dpoCourses = dpoObj

        this.setCourseKey(0)
        this.renderCircles()
        this.renderCourseBlocks()
        this.addListenerToButtons()

        this.modal.buttonHandler(this.addToCard.bind(this))
    }

    setCourseKey(index: number) {
        this.currentCourseKey = Object.keys(this.dpoCourses)[index]
    }

    clickAndEnterListener(el: any, cb: Function) {
        el.addEventListener('click', cb)

        el.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.code === 'Enter') {
                cb()
            }
        })
    }

    renderCircles() {
        const circles = document.querySelectorAll('.circle')

        const circleClickHandler = (key: string, idx: number) => {
            circles.forEach(item => item.classList.remove('selected'))
            circles[idx].classList.add('selected')
            this.currentCourseKey = key
            this.renderCourseBlocks()
        }

        // Устанавливаем название отделений из объекта
        Object.keys(this.dpoCourses).forEach((key, idx) => {
            circles[idx].textContent = key

            // Добавляем прослушку событий на каждый из элементов отделения
            circles[idx].addEventListener('click', () => {
                circleClickHandler(key, idx)
            })

            // Прослушка событий при нажатии на Enter
            this.clickAndEnterListener(circles[idx], () => circleClickHandler(key, idx))
        })
    }

    renderCourseTemplate(course: Course, courseState?: CourseStates) {
        return `
            <div class="course ${courseState ? `with-state ${courseState}` : ''}" tabindex="0">
                 <p class="course__text">${course.title}</p>
                 <div class="course__img" style="background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('${course.image}') center / cover;"></div>
            </div>
        `
    }

    renderCourseBlocks() {
        const clickHandler = (course: Course) => {
            this.currentCourse = course
            this.modal.setContent(course)
        }

        const wrap = document.querySelector('.all-course .course-wrap')

        // render elements
        wrap.innerHTML = this.dpoCourses[this.currentCourseKey].map(item => this.renderCourseTemplate(item)).join('')

        // add listeners
        wrap.querySelectorAll('.course').forEach((course, index) => {
            const clickFn = () => clickHandler(this.dpoCourses[this.currentCourseKey][index])

            this.clickAndEnterListener(course, clickFn)
        })
    }

    addToCard() {
        if (this.card.filter(itemInCard => itemInCard.title === this.currentCourse.title).length > 0) {
            return
        }

        this.card.push({...this.currentCourse, courseState: this.modal.courseState} as CourseWithState)
        this.renderSelectedCourse()
    }

    renderSelectedCourse() {
        const $selectedWrap = document.querySelector('.selected-course .course-wrap')
        $selectedWrap.innerHTML = this.card.map((item: CourseWithState) => this.renderCourseTemplate(item, item.courseState)).join('')

        $selectedWrap.querySelectorAll('.course').forEach((course, idx) => {
            this.clickAndEnterListener((course), () => {
                if (confirm('Вы хотите удалить данный курс из корзины?')) {
                    this.card.splice(idx, 1)
                    this.renderSelectedCourse()
                }
            })
        })
    }

    addListenerToButtons() {
        const $removeAll = document.querySelector('.button-wrap .remove')
        const $sendButton = document.querySelector('.button-wrap .send')

        $removeAll.addEventListener('click', () => {
            if (confirm('Вы действительно хотите удалить все выбранные курсы?')) {
                this.card = []
                this.renderSelectedCourse()
            }
        })
    }
}