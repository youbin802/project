import { CodeMirrorLib } from "./codeMirrorLib.js";
import {dark} from './dark.js';
import {studentFileFolder} from './studentFileFolder.js';
import {codeDownLoad} from './code_download.js';
const log = console.log;
class Student {
    constructor() {
        this.init();
    }

    init() {
        const cm = new CodeMirrorLib();
        this.addEvent();
        this.dark();
        this.tabHandler(document.querySelectorAll("#explorer_nav button")[0]);
        $(document.querySelector("#menu_name")).hide();
        this.fileFolder();
        this.codeDown();
    }

    addEvent() {
        // 익스플로러 메뉴 탭 버튼 이벤트
        document.querySelectorAll("#explorer_nav button").forEach(tabBtn => {
            tabBtn.addEventListener("click", () => {
                this.tabHandler(tabBtn);
            });
        });


        // 쪽지함 보내기 모달 버튼 이벤트
        document.querySelector("#send_modal_btn").addEventListener("click", this.openSendModal);
        // 쪽지함 보내기 모달 버튼 이벤트
        document.querySelector("#apply_modal_btn").addEventListener("click", this.openApplyModal);
        // 모달 닫기 버튼 이벤트
        document.querySelectorAll(".close_modal_btn").forEach(btn => {
            btn.addEventListener("click", this.closeModal);
        });
        
        // 쪽지함 보낸쪽지 이벤트
        document.querySelectorAll("#letter_list").forEach(li => {
            li.addEventListener("click", this.shwoLetterContent);
        });

        // 공유파일 이벤트
        document.querySelectorAll("#share_file_list").forEach(li => {
            li.addEventListener("click", this.shwoShareFileContent);
        });

        //실시간 바 이벤트
        document.querySelector("#live_bar").addEventListener("click", this.showLiveView);
    }

    tabHandler = (tabBtn) => {
        document.querySelector("#share_file_view").style.display = "none";

        let idx = parseInt(tabBtn.getAttribute("data-idx")); 
        // explorer 처리
        this.changeTab("#explorer > div", "block", idx);
        // workspace 처리
        this.changeTab("#worksapce_box > div", "block", idx);
        // 탭 제목 바꾸기
        if (idx == 1) {
            this.showMenuName("내 폴더");
        } else if (idx == 2) {
            this.showMenuName("쪽지함");
        }
    }

    changeTab(select, dis, idx) {
        document.querySelectorAll(select).forEach(e => {
            e.style.display = "none";
        });
        document.querySelectorAll(select)[idx].style.display = dis;
        if (idx == 0) {
            document.querySelector("#live_view").style.display = "block";
        }
        // 파일 탭 누른 경우: 라이브랑 파일 뷰가 같이 있어서, 라이브 뷰를 기본으로 보여줌 
        if (idx == 0) {
            document.querySelector("#live_view").style.display = "block";
        }
    }

    showMenuName(name) {
        // 선택된 메뉴(파일) 제목 처리 메소드

        let h1 = document.querySelector("#menu_name");
        h1.innerHTML = `${name}`;
    
        $(h1).fadeIn();
        setTimeout(()=> {
            $(h1).fadeOut();
        }, 1500);
        
        /*
        파일 제이슨이나 클래스같은 자료 있을 것
        클릭하면 그거의 idx로 자료에서 찾아서 그 변수를 넣어줌
        */
    }

    openSendModal() {
        $("#send_modal").fadeIn();
    }

    openApplyModal() {
        $("#apply_modal").fadeIn();
    }

    closeModal() {
        $(this.parentNode.parentNode).fadeOut();
    }


    shwoLetterContent() {
        log("쪽지 내용 채우기");
        //여기서 쪽지 내용 서버에서 받으면 보여주기 처리
    }


    shwoShareFileContent = () => {
        //공유파일 리스트 li 클릭

        // workspace 처리
        document.querySelector("#live_view").style.display = "none";
        document.querySelector("#share_file_view").style.display = "block";
        // 파일 이름 표시
        this.showMenuName(this);
    }

    showLiveView = () => {
        // 실시간 코드 바 버튼

        // workspace 처리
        document.querySelector("#live_view").style.display = "block";
        document.querySelector("#share_file_view").style.display = "none";
    }

    //다크모드
    dark() {
        const darkd = new dark();
    }
    
    fileFolder() {
        const fileFolder = new studentFileFolder();
    }

    codeDown() {
        const down = new codeDownLoad();
    }
}

window.onload =()=> {
    const student = new Student();
}