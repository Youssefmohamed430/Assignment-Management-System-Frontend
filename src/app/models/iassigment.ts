export class IAssigment {
    assignmentId: number = 0;
    title: string = '';
    deadline: Date = new Date();
    assignmentFile!:File;
    courseId: number = 0;
}
