import { CodeMirrorLib } from './codeMirrorLib.js'

export class codeDownLoad {
  constructor() {
    this.addEvent()
  }

  addEvent() {
    const lib = new CodeMirrorLib()
    lib.getModeName()
    document.querySelector('#code_down').addEventListener(
      'click',
      function () {
        var textInput = lib.editor.getValue()
        var filename = 'MainApp.java'
        download(filename, textInput)
        console.log(textInput)
      },
      false,
    )

    function download(filename, textInput) {
      var element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput),
      )
      element.setAttribute('download', filename)
      document.body.appendChild(element)
      element.click()
    }
  }
}
