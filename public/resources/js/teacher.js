import { CodeMirrorLib } from './codeMirrorLib.js'
import { FileDrop } from './fileDrop.js'
import { FolderDrop } from './folderDrop.js'
import { dark } from './dark.js'
import { teacherFileFolder } from './teacherFileFolder.js'
import { teacherCode } from './teacher_code.js'

const log = console.log
class Teacher {
  constructor() {
    this.init()
  }

  init() {
    const cm = new CodeMirrorLib()
    this.addEvent()
    this.tabHandler(document.querySelectorAll('#explorer_nav button')[0])
    $(document.querySelector('#menu_name')).hide()
    this.dark()
    this.fileFolder()
    this.teacherCode()

    // get : fetch . post : ajax
  }

  addEvent() {
    // 익스플로러 메뉴 탭 버튼 이벤트
    document.querySelectorAll('#explorer_nav button').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        this.tabHandler(tabBtn)
      })
    })

    // 파일생성 모달
    document
      .querySelector('#careat_file_modal_btn')
      .addEventListener('click', this.openCreatFileModal)
    // 파일옵션수정 모달
    document
      .querySelector('#modify_option_modal_btn')
      .addEventListener('click', this.openModifyOptionModal)
    // 학생목록 쪽지 모달 이벤트
    document.querySelectorAll('.stu_list > li').forEach((li) => {
      li.addEventListener('click', this.openDirectModal)
    })
    // 쪽지함 보내기 모달 버튼 이벤트
    document
      .querySelector('#send_modal_btn')
      .addEventListener('click', this.openSendModal)
    // 쪽지함 보내기 모달 버튼 이벤트
    document
      .querySelector('#apply_modal_btn')
      .addEventListener('click', this.openApplyModal)
    // 모달 닫기 버튼 이벤트
    document.querySelectorAll('.close_modal_btn').forEach((btn) => {
      btn.addEventListener('click', this.closeModal)
    })

    // 쪽지함 보낸쪽지 이벤트
    document.querySelectorAll('#letter_list').forEach((li) => {
      li.addEventListener('click', this.shwoLetterContent)
    })

    // // 공유파일 이벤트
    document.querySelectorAll('#share_file_list').forEach((li) => {
      li.addEventListener('click', this.shwoShareFileContent)
    })

    //실시간 바 이벤트
    document
      .querySelector('#live_bar')
      .addEventListener('click', this.showLiveView)

    document
      .querySelector('#createFolder')
      .addEventListener('click', this.openCreateFolderModal)
    console.log(document.querySelector('#FolderBtn'))

    document
      .querySelector('#FolderBtn')
      .addEventListener('click', this.ModelMore)
  }

  tabHandler = (tabBtn) => {
    document.querySelector('#share_file_view').style.display = 'none'
    let idx = parseInt(tabBtn.getAttribute('data-idx'))

    if (idx == 0) {
      const fileDrop = new FileDrop()
      fileDrop.fileDropDown()
    } else if (idx == 1) {
      const folderDrop = new FolderDrop()
      folderDrop.event()
    }

    // explorer 처리
    this.changeTab('#explorer > div', 'block', idx)
    // workspace 처리
    this.changeTab('#worksapce_box > div', 'block', idx)
    // 탭 제목 바꾸기
    if (idx == 1) {
      this.showMenuName('내 폴더')
    } else if (idx == 2) {
      this.showMenuName('학생 목록')
    } else if (idx == 3) {
      this.showMenuName('쪽지함')
    }
  }

  changeTab(select, dis, idx) {
    document.querySelectorAll(select).forEach((e) => {
      e.style.display = 'none'
    })
    document.querySelectorAll(select)[idx].style.display = dis
    if (idx == 0) {
      document.querySelector('#live_view').style.display = 'block'
    }
  }
  // 폴더 생성 부분
  openCreateFolderModal() {
    $('#create_f_modal').fadeIn()
  }

  ModelMore() {
    let parent = $('#parent').val()
    let name = $('#folderName').val()
    console.log(parent, name)
    const json = { parent: parent, name: name }
    $.ajax({
      url: 'http://localhost:3000/user/folder/',
      type: 'POST',
      data: JSON.stringify(json),
      contentType: 'application/json',
      timeout: 3000,
      async: false,
      success: function (result) {
        if (result) {
          alert('완료')
          $('#create_f_modal').fadeOut()
        } else {
          alert('업로드 실패')
        }
      },
      error: function (err) {
        alert('에러 발생')
        console.log(err)
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log('2. fail 을 탄다 : ' + errorThrown)
    })
  }

  showMenuName(name) {
    // 선택된 메뉴(파일) 제목 처리 메소드
    let h1 = document.querySelector('#menu_name')
    h1.innerHTML = `${name}`

    $(h1).fadeIn()
    setTimeout(() => {
      $(h1).fadeOut()
    }, 1500)

    /*
        파일 제이슨이나 클래스같은 자료 있을 것
        클릭하면 그거의 idx로 자료에서 찾아서 그 변수를 넣어줌
        */
  }

  openCreatFileModal() {
    $('#careat_file_modal').fadeIn()
  }

  openModifyOptionModal() {
    $('#modify_option_modal').fadeIn()
  }

  openDirectModal() {
    $('#direct_modal').fadeIn()
  }

  openSendModal() {
    $('#send_modal').fadeIn()
  }

  openApplyModal() {
    $('#apply_modal').fadeIn()
  }

  closeModal() {
    $(this.parentNode.parentNode).fadeOut()
  }

  shwoLetterContent() {
    log('쪽지 내용 채우기')
    //여기서 서버에서 온 쪽지 내용 보여주기 처리
  }

  shwoShareFileContent = (e) => {
    // workspace 처리
    document.querySelector('#live_view').style.display = 'none'
    document.querySelector('#share_file_view').style.display = 'block'
    // 파일 이름 표시
    let str = e.target.innerText
    this.showMenuName(str.substr(0, str.length - 1))
  }

  showLiveView = () => {
    // workspace 처리
    document.querySelector('#live_view').style.display = 'block'
    document.querySelector('#share_file_view').style.display = 'none'
  }

  dark() {
    const darkd = new dark()
  }

  fileFolder() {
    const fileFolder = new teacherFileFolder()
  }

  teacherCode() {
    const code = new teacherCode()
  }
}

window.onload = () => {
  const teacher = new Teacher()
}
