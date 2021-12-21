export class teacherFileFolder {
  constructor() {
    this.getFile()
    this.getFolder()
  }

  getFile() {
    ;(async () => {
      let res = await fetch(
        'http://localhost:3000/class/0a0c3485-6f31-4376-b/file',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const json = await res.text()
      const file_info = JSON.parse(json).result

      const fileList = document.querySelector('#teacher_share_file_list')
      if (file_info) {
        file_info.forEach((e) => {
          fileList.innerHTML += `<li data-idx="">${e.file.fileName}</li>`
        })
      }
    })()
  }
  // 코드 복사 , 내려받기, 코드 저장 : 자기 폴더 안에 저장(미정)
  // 내려받기 : index.html

  getFolder() {
    ;(async () => {
      let res = await fetch('http://localhost:3000/user/folder', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await res.text()
      const folder_info = JSON.parse(json).result

      const folderList = document.querySelector('.drive_list')
      folder_info.folder.forEach((e) => {
        folderList.innerHTML += `
                <li class="t_folder_list" data-idx="${e.folderName}" data-id="${e.folderId}" data-sort="folder">
                    <i class="far fa-folder"></i>
                    <br>
                    ${e.folderName}
                </li>`
      })

      folder_info.file.forEach((e) => {
        folderList.innerHTML += `
                <li class="t_folder_list" data-idx="${e.fileName}" data-id="${e.fileId}" data-sort="file">
                    <i class="far fa-file"></i>
                    <br>
                    ${e.fileName}
                </li>`
      })

      this.folderModal()
    })()
  }

  // 폴더 클릭시 하위 폴더 모달 띄우기
  folderModal() {
    const folderList = document.querySelectorAll('.t_folder_list')

    //최상단 폴더 이름
    const preFolderName = document.querySelector('#preFolderName')

    folderList.forEach((e) => {
      if (e.dataset.sort == 'folder') {
        e.addEventListener('click', () => {
          const subPreFolderName = document.querySelector(
            '#preFolderName > div',
          )
          subPreFolderName.remove()
          $('#folderModal').fadeIn()
          preFolderName.innerHTML += `<div>${e.dataset.idx}</div>`
          this.underFolder(e.dataset.id)
        })
      }
    })

    $('.close').click(function () {
      $('#folderModal').fadeOut()
      document.querySelectorAll('.objList').forEach((e) => {
        e.remove()
      })
    })
  }

  // 하위폴더 가져오기
  underFolder(parent) {
    ;(async () => {
      let res = await fetch('http://localhost:3000/user/folder/' + parent, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await res.text()
      const file_info = JSON.parse(json).result
      //하위 폴더, 파일 보여주는 ul
      const objList = document.querySelector('#content > ul')
      file_info.folder.forEach((e) => {
        objList.innerHTML += `<li class="objList" data-sort="folder" data-id="${e.folderId}"><i class="far fa-folder"></i> ${e.folderName}</li>`
      })
      file_info.file.forEach((e) => {
        objList.innerHTML += `<li class="objList" data-sort="file"><i class="far fa-file"></i> ${e.fileName}</li>`
      })

      document.querySelectorAll('.objList').forEach((e) => {
        this.underFolderUnder(e)
      })
    })()
  }

  // 하위 폴더 클릭해서 하위폴더의 하위폴더 가져오기
  underFolderUnder(parent) {
    if (parent.dataset.sort == 'folder') {
      parent.addEventListener('click', (e) => {
        document.querySelectorAll('.objList').forEach((e) => {
          e.remove()
        })
        this.underFolder(parent.dataset.id)
      })
    }
  }
}
