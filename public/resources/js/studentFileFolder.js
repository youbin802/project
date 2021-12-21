export class studentFileFolder {
    constructor() {
        this.getFile();
        this.getFolder();
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

            const fileList = document.querySelector("#share_file_list");

            file_info.forEach(e => {
                fileList.innerHTML += `<li>${e.file.fileName}</li>`;
            })


        })()
    }

    getFolder() {
        ;(async () => {
            let res = await fetch(
              'http://localhost:3000/user/folder',
              {
                method: 'get',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            const json = await res.text()
            const folder_info = JSON.parse(json).result
            
            const folderList = document.querySelector(".drive_list");
            folder_info.folder.forEach(e=> {
                folderList.innerHTML += `
                <li>
                    <i class="far fa-folder"></i>
                    <br>
                    ${e.folderName}
                </li>`;
            })

            folder_info.file.forEach(e=> {
                folderList.innerHTML += `
                <li>
                    <i class="far fa-file"></i>
                    <br>
                    ${e.fileName}
                </li>`;
            })


        })()
    }

}