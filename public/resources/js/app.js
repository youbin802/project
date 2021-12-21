const log = console.log
import { student_class_modal } from './student_class_modal.js'
import { dark } from './dark.js'
import { uploadImg } from './upload.js'
import { Pagenation } from './pagenation.js'
import { FindTeacher } from './findTeacher.js'
import { Teacher_class_modal } from './teacher_class_modal.js'

class App {
  constructor() {
    this.init()
  }

  init() {
    this.drawClass()
    this.modalWork()
    this.modalUp()
    this.imgUpload()
    this.pagination()
    this.modalTeacherWork()
    this.findTeacher()
    this.dark()

    document
      .querySelector('#create-btn > button')
      .addEventListener('click', () => {
        const className = document.querySelector('#className')
        this.createClass(className.value)
        className.value = ''
      })
  }

  createClass(className) {
    let list = { name: className, teacher: ['test'] }
    $.ajax({
      url: 'http://localhost:3000/class',
      type: 'POST',
      data: JSON.stringify(list),
      contentType: 'application/json',
      timeout: 3000,
      async: false,
      success: function (result) {
        alert('수업 생성 완료')
      },
      error: function (err) {
        console.log(err)
      },
    }).fail(function (errorThrown) {
      console.log('fail 탐', errorThrown)
    })
  }

  pagination() {
    ;(async () => {
      let res = await fetch('http://localhost:3000/user/class', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await res.text()
      const class_info = JSON.parse(json).result
      const pg = new Pagenation()
      pg.render($('#my-class'), class_info, $('#pagination1'))
      pg.render($('#modal1-class'), class_info, $('#pagination2'))
    })()
  }

  //페이지네이션 하기 위해
  drawClass() {
    // const Page = new test();
    // const pg = new Pagenation();
    // pg.yu($("#my-class"), this.imgList)
  }

  //모달에 있는 js 가져오기 위해서
  modalWork() {
    const modal = new student_class_modal()
  }

  modalTeacherWork() {
    const tw = new Teacher_class_modal()
  }

  imgUpload() {
    const upload = new uploadImg()
  }

  //모달 띄우기 위해서
  modalUp() {
    const user_info = 'teacher'
    // const user_info = "student"

    $('#addBtn').click(function () {
      if (user_info == 'student') {
        $('#modal1').fadeIn()
      } else if (user_info == 'teacher') {
        $('#modal2').fadeIn()
      }
    })

    $('.close').click(function () {
      $('#modal1').fadeOut()
      $('#modal2').fadeOut()
    })
  }

  //검색
  async findTeacher() {
    const find = new FindTeacher()
    find.find()
  }

  //다크모드
  dark() {
    const darkd = new dark()
  }
}

window.onload = () => {
  const app = new App()
}
