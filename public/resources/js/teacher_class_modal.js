import { FindTeacher } from './findTeacher.js'

export class Teacher_class_modal {
  constructor() {
    this.list = null

    this.init()
  }

  init() {
    this.getTeacherJson()
    this.classWorkDisplay('#class-create')
  }

  async getTeacherJson() {
    ;(async () => {
      let res = await fetch('http://localhost:3000/user/class', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await res.text()
      this.list = JSON.parse(json).result

      this.addEvent()
      this.pageNextTarget()
    })()
  }

  // 수업생성/수정 박스 디스플레이
  classWorkDisplay(blockBox) {
    if (blockBox == '#class-modify') {
      document.querySelector('#class-modify').style.display = 'block'
      document.querySelector('#class-create').style.display = 'none'
    } else {
      document.querySelector('#class-modify').style.display = 'none'
      document.querySelector('#class-create').style.display = 'block'
    }
  }

  // 내수업 박스 렌더하는 메소드
  classRender() {
    let divList = document.querySelectorAll('#modal2-class > div')
    for (let i = 0; i < divList.length; i++) {
      let idx = divList[i].getAttribute('data-idx')
      divList[i].innerHTML += `<div class="list" data-id="${this.list[idx - 1].classId}">
      ${this.list[idx - 1].className}
      </div>`
    }
  }

  // 수업수정 박스 렌더하는 메소드
  modifyRender = (e) => {
    $('.photoFrame').remove()

    let idx = e.target.getAttribute('data-idx')
    let data = this.list[idx - 1]

    //섬네일 변경
    let thumbnail = document.querySelector('#class-modify .thumbnail')
    // thumbnail.style = `background-image: url("../resources/images/class_images/${data.img}");
    //                         background-size: cover;`

    //교과명 표시
    let subject = document.querySelector('#class-modify #subject')
    subject.value = data.className

    this.classWorkDisplay('#class-modify')

    document.querySelector('#delete-btn > button').addEventListener('click', ()=> {
      this.classDelete(data.classId)
    })

  }

  // 수업 삭제 함수
  classDelete(id) {
    console.log(id);
    $.ajax({
      url: 'http://localhost:3000/class/',
      type: 'DELETE',
      data: id,
      contentType: 'application/json',
      timeout: 3000,
      async: false,
      success: function (result) {
        alert('수업 삭제 완료')
      },
      error: function (err) {
        console.log(err)
      },
    }).fail(function (errorThrown) {
      console.log('fail 탐', errorThrown)
    })
  }




  // 수정사항 반영 메소드
  updateModify = (e) => {
    $('.photoFrame').remove()

    // 파일이름 가져오기
    const files = e.target.files
    let selectedFile = files[0]
    let reader = new FileReader()

    // console.log(selectedFile.name, files.length);

    // 썸네일 미리보기 표시
    for (let i = 0; i < files.length; i++) {
      if (!selectedFile.type.startsWith('image/')) {
        continue
      }

      const div = document.createElement('div')
      div.classList.add('photoFrame')

      reader.addEventListener('load', function () {
        div.style = `background-image: url(${reader.result})`
        document.querySelector('#class-modify .thumbnail').appendChild(div)
      })

      if (selectedFile) {
        reader.readAsDataURL(selectedFile)
      }
    }

    //파일 업로드 해야함  => 받아줄 서버가 필요하지 않을까
    //그다음 json 변경 ..??
  }

  // 페이지네이션 프리브 idx
  pagePrevTarget = (e) => {
    let divList = document.querySelectorAll('#modal2-class > div')
    let classDivList = document.querySelectorAll('.list')
    classDivList.forEach((div) => {
      div.remove()
    })
    let idx = divList[0].getAttribute('data-idx')
    if (idx > 1) {
      if (idx > this.list.length) {
        idx--
      }
      for (let i = divList.length - 1; i >= 0; i--) {
        idx--
        $(divList[i]).attr('data-idx', idx)

      }
    }
    this.classRender()
  }

  // 페이지네이션 넥스트 idx
  pageNextTarget = (e) => {
    let classDivList = document.querySelectorAll('.list')
    classDivList.forEach((div) => {
      div.remove()
    })
    let divList = document.querySelectorAll('#modal2-class > div')

    let idx = divList[divList.length - 1].getAttribute('data-idx')

    if (idx < this.list.length) {
      divList.forEach((e) => {
        idx++
        $(e).attr('data-idx', idx)

      })
    }
    this.classRender()
  }

  addEvent() {
    // 내수업 클릭
    document.querySelectorAll('#modal2-class > div').forEach((e) => {
      e.addEventListener('click', this.modifyRender)
    })

    //썸네일 파일인풋
    document.querySelector('#class-modify #fileOnload').onchange =
      this.updateModify

    //modal2 X버튼 클릭-> 생성박스로 설정
    document.querySelector('#modal2 .close').addEventListener('click', () => {
      this.classWorkDisplay('#class-create')
    })

    //page-btn 클릭 / data-idx를 제어하기 위해 (따로 임포트한 페이지네이션 코드 없음)
    let pageBtns = document.querySelectorAll('#modal2 .page-btn > i')
    pageBtns[0].addEventListener('click', this.pagePrevTarget)
    pageBtns[1].addEventListener('click', this.pageNextTarget)
  }
}
