import { FindClass } from "./findClass.js";

const log = console.log;
export class student_class_modal {
    constructor() {
        this.list;
        this.getTeacherJson();
    }

    async getTeacherJson() {
        let res = await fetch('../resources/js/classData.json');
        let json = await res.json();
        this.list = json;
        this.findTeacher();
    }

    findTeacher() {
        const ft = new FindClass();
        ft.find(this.list);
    }


}
