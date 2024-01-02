// 展示.part类的内容
function showModal(content) {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = content;
    modal.style.display = "block";
}

//隐藏模态框
function hideModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// 监听用户是否点击了“点击查看”按钮
var checkElements = document.querySelectorAll("#check");
checkElements.forEach(function (element) {
    element.addEventListener("click", function () {
        var partContent = this.parentElement.querySelector(".part").innerHTML;
        showModal(partContent);
    });
});

//关闭按钮
var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", hideModal);