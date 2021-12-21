export class FindClass {

    constructor() {
        this.ClassList=[];
    }

    find(list) {
        let input = document.querySelector("#classValue");
        const nameHtml = document.querySelector("#modal-box > .class");

        input.addEventListener('keypress', function(key) {
            if(key.key == 'Enter') {
                let name = list.find(e => e.name == input.value);
  
                nameHtml.innerHTML += `
                    <img src="../resources/images/class_images/${name.img}" alt="${name.name}" title="${name.name}" data-idx="${name.name}">
                `;

                input.value = "";
            }
        })

    }
}