const log = console.log;
export class FileDrop {
    constructor() {
        this.fileIndex = 0;
        this.totalFileSize = 0;
        // 등록 가능한 파일 사이즈 MB
        this.uploadSize = 50;
        // 등록 가능한 총 파일 사이즈 MB
        let maxUploadSize = 500;
        this.fileList = [];
    }

    fileDropDown() {
        let dropZone = $("#file_drop_area");

        dropZone.on('dragenter',function(e){
            e.stopPropagation();
            e.preventDefault();
     
            dropZone.css('background-color','#E3F2FC');
        });
        
        dropZone.on('dragleave',function(e){
            e.stopPropagation();
            e.preventDefault();
 
            dropZone.css('background-color','#FFFFFF');
        });
        
        dropZone.on('dragover',function(e){
            e.stopPropagation();
            e.preventDefault();
 
            dropZone.css('background-color','#E3F2FC');
        });
        
        dropZone.on('drop', (e)=>{
            e.preventDefault();
            dropZone.css('background-color','#36393f');
            let files = e.originalEvent.dataTransfer.files;
            console.log(files);
            if (files != null) {
                if (files.length < 1) {
                    alert("폴더 업로드 불가");
                    return;
                }
                this.selectFile(files);
            } else {
                alert("ERROR");
            }
        });
    }

    checkFile(fileName) {
        const nameOverlap = document.querySelectorAll(".upload-file > div");
        let arr = []
        nameOverlap.forEach(e => {
            arr.push(e.innerHTML);
        })
        return arr.includes(fileName)
    }

    selectFile(files){
        if(files != null){
            for(let i = 0; i < files.length; i++) {
                let fileName = files[i].name;
                let fileSize = files[i].size / 1024 / 1024;
                if(files[i].type != "application/x-zip-compressed" && files[i].type != "") {
                    if(!this.checkFile(fileName)) {
                        if(fileSize > this.uploadSize){
                            alert("용량 초과\n업로드 가능 용량 : " + this.uploadSize + " MB");
                            break;
                         }else{
                            this.fileModal(files,this.fileIndex,fileName,i);
                            this.fileIndex++;
                         }
                    } else {
                        alert("이미 그 파일이 존재합니다.")
                    }
                } else {
                    alert("공유할 수 있는 파일이 아닙니다.")
                }
                
            }
        }else{
            alert("ERROR");
        }
    }

    //모달 띄우기
    fileModal(files,fileIndex,fileName,i) {
        $("#careat_file_modal").fadeIn();
        let cnt = 0;
        const createBtn = document.querySelector(".modal_btn")
        createBtn.addEventListener("click", () => {
            if(cnt==0) {
                this.fileList.push({'name':files[i].name, 'idx':fileIndex});
                this.addFileList(fileName)
                cnt++
            }
            $("#careat_file_modal").fadeOut();
        })

        

    }
 
    addFileList(fileName){
        document.querySelector(".exp_list").innerHTML += 
        `<li class="upload-file">
            ${fileName}
            <button class="file_remove_btn" value="${this.fileIndex}"><i class="fas fa-times"></i></button>
         </li>`

        this.deleteFile();
    }
 
 
    deleteFile() {
        let btnList = document.querySelectorAll(".file_remove_btn");
        btnList.forEach(btn=> {
            btn.addEventListener("click", (e)=> {
                let value = e.currentTarget.value;
                this.fileList = this.fileList.filter(x=> x.idx != value);
                btn.parentNode.remove();
            })
        })
    }
}   
   



   