import {Modal} from './modal'
import {Course, CourseStates, CourseWithState, Department} from '../../types/dpo.types'

export class DPO {
    departments: Department
    card: Course[] = []
    currentCourse: Course | CourseWithState
    currentCourseKey: string
    modal: Modal = new Modal()
    HTMLElements: {
        removeBtn: HTMLButtonElement,
        scrollToFormBtn: HTMLButtonElement,
        sendBtn: HTMLButtonElement,
    } = {
        removeBtn: null,
        scrollToFormBtn: null,
        sendBtn: null,
    }

    constructor(dpoObj: Department) {
        this.departments = dpoObj

        this.setCourseKey(0)
        this.renderCircles()
        this.renderCourseBlocks()

        this.modal.buttonHandler(this.addToCard.bind(this))

        this.findHtmlElements()
        this.addListenerToButtons()
    }

    findHtmlElements() {
        this.HTMLElements.removeBtn = document.querySelector('.button-wrap .remove')
        this.HTMLElements.scrollToFormBtn = document.querySelector('.button-wrap .send')
        this.HTMLElements.sendBtn = document.querySelector('.form input[type="submit"]')
    }

    setCourseKey(index: number) {
        this.currentCourseKey = Object.keys(this.departments)[index]
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
        const circles: NodeListOf<HTMLDivElement> = document.querySelectorAll('.circle')

        const circleClickHandler = (key: string, idx: number) => {
            circles.forEach(item => item.classList.remove('selected'))
            circles[idx].classList.add('selected')
            this.currentCourseKey = key
            this.renderCourseBlocks()
        }

        // Устанавливаем название отделений из объекта + настройки
        Object.keys(this.departments).forEach((key, idx) => {
            const currentCircle = circles[idx]
            currentCircle.textContent = key

            currentCircle.style.backgroundColor = this.departments[key].options.circleColor

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
        wrap.innerHTML = this.departments[this.currentCourseKey].items.map(item => this.renderCourseTemplate(item)).join('')

        // add listeners
        wrap.querySelectorAll('.course').forEach((course, index) => {
            const clickFn = () => clickHandler(this.departments[this.currentCourseKey].items[index])

            this.clickAndEnterListener(course, clickFn)
        })
    }

    addToCard() {
        if (this.card.filter(itemInCard => itemInCard.title === this.currentCourse.title).length > 0) {
            return
        }

        this.changeStateButton(true)

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

        // insert in form

        const formCourseUl = document.querySelector('.form-course')
        formCourseUl.innerHTML = ''
        if (this.card.length === 0) {
            formCourseUl.textContent = 'Не выбран ни один курс'
        }
        this.card.map((item: CourseWithState) => {
            const li = document.createElement('li')
            li.textContent = `${item.title} (${item.courseState === CourseStates.regular ? 'Обычный' : 'Продвинутый'} уровень)`
            formCourseUl.appendChild(li)
        })
    }

    changeStateButton(allow?: boolean) {
        const btns = [this.HTMLElements.scrollToFormBtn, this.HTMLElements.sendBtn]

        if (allow) {
            btns.forEach((btn) => {
                btn.classList.remove('not-allowed')
                btn.classList.add('accent')
            })
        } else {
            btns.forEach((btn) => {
                btn.classList.add('not-allowed')
                btn.classList.remove('accent')
            })
        }
    }

    addListenerToButtons() {
        this.changeStateButton()

        this.HTMLElements.removeBtn.addEventListener('click', () => {
            if (confirm('Вы действительно хотите удалить все выбранные курсы?')) {
                this.card = []
                this.renderSelectedCourse()
                this.changeStateButton()
            }
        })

        this.HTMLElements.scrollToFormBtn.addEventListener('click', function() {
            if (this.classList.contains('not-allowed')) {
                return
            }

            const el = document.querySelector('form.form')
            const fioInput: HTMLInputElement = document.querySelector('input#fio')
            el.scrollIntoView({block: 'center', behavior: 'smooth'})
            fioInput.focus()
        })
    }
}