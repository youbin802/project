export class dark {
    constructor() {
        this.changeMode()
    }

    changeMode() {
        document.querySelector('.checkbox').addEventListener('change',()=>{
            document.querySelectorAll('body').forEach(e=>{
                e.classList.toggle('night');
          })
        });
    }

}