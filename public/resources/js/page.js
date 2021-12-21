const log = console.log;
export class test {
    constructor() {
        this.imgList = ['1623117.jpg','1623122.jpg','1623136.jpg','1623145.jpg','1623209.jpg','1623206.jpg','1623117.jpg','1623122.jpg','1623136.jpg','1623145.jpg','1623209.jpg','1623206.jpg'];
        // 현재 페이지
        this.NOW_PAGE = 1;
        // 힌 페이지당 보여질 개수
        this.PAGE_SHOW = 4;
        // 현재 시작 idx
        // this.chapStart= 1;
        // this.render();
        // this.addEvent();
        
        // //현재 위치
        // this.current = 0;
        // this.list;
    }
    
    render() {
        // 현재 끝 idx
        const user_info = "teacher"
        // const user_info = "student"
        this.chapEnd =  this.NOW_PAGE * this.PAGE_SHOW;

        //현재 위치 계산
        $("#addBtn").click(function () {
            if(user_info == "student") {
                this.current = 1
            } else if(user_info == "teacher") {
                this.current = 2
            }
        });

        $("#modal2-box .class").click(function () {
            this.current = 3
        })

        $(".close").click(function() {
            this.current = 0
        });

        //////
        
        if(this.current == 0) {
            this.list = $("#my-class");
        } else {
            if(user_info == "student") {
                this.list = $("#modal2-class");
            } else if(user_info == "teacher") {
                this.list = $("#modal3-class");
            }
        }

        this.list.empty();
        for(let i=this.chapStart; i<=this.chapEnd; i++) {
            let img = this.imgthis.List[i];
            if(img == undefined) return;
            const div = document.createElement('div');
            div.classList.add('class');
            div.innerHTML=`<img src="../resources/images/class_images/${img}">`;

            list.append(div);
        }
    }

    prevClick = e => {
        if (this.NOW_PAGE <= 1) return;
        this.NOW_PAGE  -=1;
        this.chapStart -= this.PAGE_SHOW;
        this.chapEnd = this.chapEnd/this.PAGE_SHOW;
        this.render();
    }
    
    nextClick = e => {
        if (this.NOW_PAGE >= this.imgList.length/this.PAGE_SHOW) return;
        this.NOW_PAGE  +=1;
        this.chapStart = this.chapEnd +1;
        this.render();
    }

    addEvent() {
        document.querySelector("#next").addEventListener("click", this.nextClick);
        document.querySelector("#prev").addEventListener("click", this.prevClick);
    }

    
}
