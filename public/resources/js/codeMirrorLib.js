export class CodeMirrorLib {
  constructor() {
    this.name = 'meta.js'
    this.kind = this.name.split('.')[1]

    this.editor
  }

  getModeName() {
    let modeName = ''
    switch (this.kind) {
      case 'js':
        modeName = 'javascript'
        break
      case 'html':
        modeName = 'xml'
        break
      case 'py':
        modeName = 'python'
        break
      case 'css':
        modeName = 'css'
        break
      case 'php':
        modeName = 'php'
        break
      default:
        break
    }

    this.modeSession(modeName)
  }

  modeSession(modeName) {
    let code = $('.codemirror-textarea')[0]
    let areaList = document.querySelectorAll('.codemirror-textarea')
    areaList.forEach((data) => {
      console.log(data)
      this.editor = CodeMirror.fromTextArea(data, {
        // 키업했을 때 줄 자동완성 정리
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        mode: modeName,
        lineNumbers: true,
        theme: 'darcula',
        autoCloseTage: true,
      })
    })
    this.addEvent(this.editor)
  }

  addEvent() {
    document
      .querySelector('#code_compair_btn')
      .addEventListener('click', this.getText)
  }

  getText(editor) {
    console.log(editor)
    // .doc.size
  }
}

// CodeMirror.addLineClass('CodeMirror-line', "wrap", "mark");
