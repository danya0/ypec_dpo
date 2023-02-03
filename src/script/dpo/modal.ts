import {Course, CourseStates} from '../../types/dpo.types'

export class Modal {
    $modal: HTMLDivElement
    $modalContainer: HTMLDivElement
    $mTitle: HTMLDivElement
    $mHours: HTMLDivElement
    $mDescribe: HTMLDivElement
    $mImg: HTMLImageElement
    $closeBtn: HTMLButtonElement
    $addBtn: HTMLButtonElement
    $price: HTMLDivElement
    courseState: CourseStates

    constructor() {
        this.findHtmlElements()

        const closeHandler = () => {
            this.hideModal()
        }

        this.$modal.addEventListener('click', closeHandler)
        this.$closeBtn.addEventListener('click', closeHandler)

        this.$modalContainer.addEventListener('click', e => {
            e.stopPropagation()
        })
    }

    findHtmlElements(): void {
        this.$modal = document.querySelector('.modal')
        this.$modalContainer = document.querySelector('.modal-container')
        this.$mTitle = document.querySelector('.modal__title')
        this.$mImg = document.querySelector('.modal__img')
        this.$mDescribe = document.querySelector('.modal__describe')
        this.$mHours = document.querySelector('.modal__text .hours')
        this.$closeBtn = document.querySelector('.modal .button')
        this.$addBtn = document.querySelector('.modal .button.accent')
        this.$price = document.querySelector('.modal .price')
    }

    setContent(course: Course): void {
        this.$mTitle.textContent = course.title
        this.$mHours.textContent = `${course.hours.regular}`
        this.$mDescribe.innerHTML = course.describe
        this.$mImg.src = course.image
        this.$price.textContent = course.price.toString()

        this.showModal()
        this.$addBtn.focus()
    }

    showModal(): void {
        document.body.style.overflow = 'hidden'
        this.$modal.classList.add('show')
    }

    hideModal(): void {
        document.body.style.overflow = 'auto'
        this.$modal.classList.remove('show')
    }

    buttonHandler(cb: Function) {
        this.$addBtn.addEventListener('click', () => {
            // this.courseState = (document.querySelector('.modal input[name="courseState"]:checked') as HTMLInputElement).id == CourseStates.regular ? CourseStates.regular : CourseStates.advanced
            // выбора уровня курсов пока нет, возвращать всегда регуляр
            this.courseState = CourseStates.regular
            cb()
            this.hideModal()
        })
    }
}

// test