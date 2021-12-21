import { CodeMirrorLib } from './codeMirrorLib.js'

export class teacherCode {
  constructor() {
    this.codeDelete()
  }

  // 작성된 코드 지우는 함수
  codeDelete() {
    // codeMirror 라이브러리 불러오는 함수
    const lib = new CodeMirrorLib()
    lib.getModeName()

    document.querySelector('#codeDelete').addEventListener('click', () => {
        lib.editor.setValue("");
    })
  }

}