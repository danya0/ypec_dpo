export interface Course {
    title: string,
    describe: string,
    image?: string,
    price: number,
    hours: {
        regular: number,
        advanced?: number
    }
}

export interface Department {
    [name: string]: {
        options: {
            circleColor: string
        },
        items: Course[]
    }
}

export interface CourseWithState extends Course {
    courseState: CourseStates
}

export enum CourseStates {
    regular = 'regular',
    advanced = 'advanced'
}