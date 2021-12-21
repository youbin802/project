export class uploadImg {
    constructor() {
        this.fileInput = document.querySelector("#fileOnload");
        this.cnt = 0;
        this.fileUpload(this.cnt)
    }

    fileUpload(cnt) {
        this.fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
              if (cnt < 1) {
                if(!reader.result.match("image/.*")) {
                    alert("이미지만 섬네일 등록이 가능(이미지 확장자가 아닙니다)")
                } else {
                    var photoFrame = document.createElement("div");
                    photoFrame.style = `background : url(${reader.result}); background-size : cover`;
                    photoFrame.className = "photoFrame";
                    document.querySelector(".thumbnail").appendChild(photoFrame);
                    document.querySelector('.photoFrame').innerHTML += `<button id="delete" class="btn btn-danger">삭제</button>`;
                    cnt++;
                    e.target.value = "";

                    document.querySelector('#delete').addEventListener("click", function () {
                        console.log(document.getElementById("pictures"));
                        document.getElementById("pictures").removeChild(photoFrame);
                        cnt--;
                    })
                }
              } else {
                alert("이미 이미지 선택됨 (기존 이미지 삭제후 재업로드 하세요)")
              }

            }
          })
    }

}