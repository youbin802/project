export class FolderDrop {
    constructor() {
        this.dropArea = document.querySelector(".folder");
    }

    event = () => {
        this.dropArea.addEventListener(
            "dragover",
            function(e) {
                e = e || event;
                e.preventDefault();
            },
            false
        );

        this.dropArea.addEventListener(
            "drop",
            function(event) {
                event.preventDefault();
                let items = event.dataTransfer.items;
                getFilesDataTransferItems(items).then(e => {
                    const obj = {
                        length: 0
                    }

                    const memo = {
                        "result": {
                            "folder": [

                            ],

                            "file": [
 
                            ]
                        }
                    }
                    
                    let n = "name";
                    
                    getFolderList(obj, e)

                    let type = e[0].type;

                    draw(type, e[0].name)

                    //파일, 폴더 그려주는 함수
                    function draw(type, name) {
                        const list = document.querySelector(".drive_list")
                        if(type == null) {
                            list.innerHTML += `
                            <li>
                                <i class="far fa-folder"></i>
                                ${name}
                            </li>
                            `
                        } else {
                            list.innerHTML += `
                            <li>
                                <i class="far fa-file"></i>
                                ${name}
                            </li>
                            `
                        }
                    }


                    function getFolderList(obj, folder, parentFolderId = '') {
                        // 폴더이름 기록, 상위 폴더 이름 기록
                        folder.forEach((dir) => {
                            const {
                                subfolder,
                                name
                            } = dir
                            obj[obj.length++] = {
                                name,
                                parentFolderId,
                                // filePath
                            }

                            if (subfolder) {
                                getFolderList(obj, subfolder, name)
                            }

                            if(dir.lastModified==undefined) {
                                memo.result.folder.push
                                ({
                                    "folderId":"1234",
                                    "folderName":dir.name,
                                })
                            } else {
                                memo.result.file.push
                                ({
                                    "fileId":"4321",
                                    "fileName":dir.name,
                                    "fileOwner":"user1",
                                    "userFileId":9
                                })
                            }

                        })

                    }
                    console.log(memo);
                })
            })

        function getFilesDataTransferItems(dataTransferItems) {
            function traverseFileTreePromise(item, path = "", folder) {
                return new Promise(resolve => {
                    if (item.isFile) {
                        item.file(file => {
                            file.filepath = path || "" + file.name; //save full path
                            folder.push(file);
                            resolve(file);
                        });
                    } else if (item.isDirectory) {
                        let dirReader = item.createReader();
                        dirReader.readEntries(entries => {
                            let entriesPromises = [];
                            let subfolder = [];
                            folder.push({
                                name: item.name,
                                subfolder: subfolder
                            });
                            for (let entr of entries)
                                entriesPromises.push(
                                    traverseFileTreePromise(entr, path || "" + item.name + "/", subfolder)
                                );
                            resolve(Promise.all(entriesPromises));
                        });
                    }
                });
            }

            let files = [];
            return new Promise((resolve, reject) => {
                let entriesPromises = [];
                for (let it of dataTransferItems)
                    entriesPromises.push(
                        traverseFileTreePromise(it.webkitGetAsEntry(), null, files)
                    );
                Promise.all(entriesPromises).then(entries => {
                    resolve(files);
                });
            });

        }



    }

}