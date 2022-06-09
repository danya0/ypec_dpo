export interface Course {
    title: string,
    describe: string,
    image?: string,
    hours: {
        regular: number,
        advanced?: number
    }
}

export interface DpoObject {
    [department: string]: Course[]
}

export interface CourseWithState extends Course {
    courseState: CourseStates
}

export enum CourseStates {
    regular = 'regular',
    advanced = 'advanced'
}