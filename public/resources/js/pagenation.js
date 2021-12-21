export class Pagenation {
    constructor() {
    }

    render(dom, list, container) {
        container.pagination({
            dataSource: list,
            pageSize:4,
            showNavigator:false,
            showPageNumbers:false,
            callback: function (data, pageSize) {
                let dataHtml="";
                  $.each(data, function (index, item) {
                    // dataHtml+= `<div class="class"><img src="../resources/images/class_images/${item}"></div>`;
                    dataHtml+= `<div class="class">${item.className}</div>`;
                });
                $(dom).html(dataHtml);
            }
        })
    }
}