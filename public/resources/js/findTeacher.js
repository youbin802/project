export class FindTeacher {
  constructor() {
    this.teacherClassList = []
  }

  find() {
    ;(async () => {
      let res = await fetch(
        'http://localhost:3000/class/875f8e4d-e2f1-4b5a-a/teacher?type=true',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const json = await res.text()
      const teacher_info = JSON.parse(json).result

      let input = document.querySelector('#teacherValue')
      const nameHtml = document.querySelector('#teacher')
      input.addEventListener('keypress', function (key) {
        if (key.key == 'Enter') {
          let name = teacher_info.find((e) => e.userName == input.value)
          if (name != null) {
            nameHtml.innerHTML += `<div><div><div>+</div></div>${name.userName}</div> `
          } else {
            alert("'" + input.value + "' 선생님은 존재하지 않습니다.")
          }
          input.value = ''
        }
      })

      let input2 = document.querySelector('#teacherValue2')
      const nameHtml2 = document.querySelector('#teacher2')
      input2.addEventListener('keypress', function (key) {
        if (key.key == 'Enter') {
          let name2 = teacher_info.find((e) => e.userName == input2.value)
          if (name2 != null) {
            nameHtml2.innerHTML += `<div> <div><div>+</div> </div>${name2.userName} </div>`
          } else {
            alert("'" + input2.value + "' 선생님은 존재하지 않습니다.")
          }
          input2.value = ''
        }
      })
    })()
  }
}
