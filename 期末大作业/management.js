// 点击问卷管理，跳转到management.HTML 页面
function goToManagementHTML() {
    // 跳转到management.html页面
    window.location.href = "management.html";
}
//点击新建问卷，跳转到edit.HTML页面
function goToEditHTML() {
    window.location.href = "edit.html";
}
//点击首页。跳转到home.HTML页面
function goToHomeHTML() {
    window.location.href = "home.html";
}
//点击编辑按钮，跳转到copyread.HTML页面
function editSurvey(index) {
    localStorage.setItem('index', index);
    window.location.href = "copyread.html";
}
//点击查看，跳转到showSurvey.HTML
function showSurvey(index) {
    localStorage.setItem('index', index);
    window.location.href = "showSurvey.html"
}
//点击发布，跳转到publishSurvey.HTML
function publishSurvey(index) {
    localStorage.setItem('index', index);
    window.location.href = "publishSurvey.html"
}
//点击填写，跳转到write.HTML
function Write(index) {
    localStorage.setItem('index', index);
    window.location.href = "write.html"
}
//点击分析按钮，跳转到analysis.HTML页面
function showAnalysis(index) {
    localStorage.setItem('index', index);
    window.location.href = "Analysis.html";
}

// 显示视频弹出框
function showVideo() {
    document.getElementById('videoOverlay').style.display = 'flex';
}

// 隐藏视频弹出框
function hideVideo() {
    document.getElementById('videoOverlay').style.display = 'none';
}
// 游戏规则部分↑
function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 将本地数据读取并展示出来
// 读取问卷数据并将其显示在 HTML 页面上
function displaySurveys() {
    // 获取问卷列表容器元素
    const surveyList = document.getElementById('survey-list');

    // 从本地存储中获取问卷数据
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

    // 遍历问卷数据并创建 HTML 元素
    surveys.forEach((surveyData, index) => {
        // 创建问卷容器元素
        const surveyContainer = document.createElement('div');
        surveyContainer.className = 'survey-container';
        let isPublish = surveyData.isPublished;
        // 创建问卷信息元素
        const infoElement = document.createElement('div');
        if (isPublish) {
            infoElement.innerHTML = `
    <input type="checkbox" name="check" onclick="turn()">
    <span class="title">${surveyData.title}</span>
    <span class="creatTime span-width">${formatDateString(surveyData.time)}</span>  
    <span class="publishTime span-width">${surveyData.publishTime ? formatDateString(surveyData.publishTime) : '未发布'}</span>
    <span class="deadLine span-width">${formatDateString(surveyData.deadline)}</span>
    <span class="isPublish span-width">${surveyData.isPublished ? "已发布" : "未发布"}</span>
    <button class="btn btn-primary btn-sm" id="shou" onclick="showSurvey(${index})">查看</button>
    <button class="btn btn-primary btn-sm" id="edit" onclick="editSurvey(${index})">编辑</button>
    <button class="btn btn-primary btn-sm" id="publish" onclick="publishSurvey(${index})" disabled>发布</button> 
    <button class="btn btn-primary btn-sm" onclick="deleteSurvey(${index})">删除</button>
    <button class="btn btn-primary btn-sm" id="write" onclick="Write(${index})">填写</button>
    <button class="btn btn-primary btn-sm" id="analysis" onclick="showAnalysis(${index})">分析</button>
  `;
        } else {
            infoElement.innerHTML = `
    <input type="checkbox" name="check" onclick="turn()">
    <span class="title">${surveyData.title}</span>
    <span class="creatTime span-width">${formatDateString(surveyData.time)}</span>  
    <span class="publishTime span-width">${surveyData.publishTime ? formatDateString(surveyData.publishTime) : '未发布'}</span>
    <span class="deadLine span-width">${formatDateString(surveyData.deadline)}</span>
    <span class="isPublish span-width">${surveyData.isPublished ? "已发布" : "未发布"}</span>
    <button class="btn btn-primary btn-sm" id="shou" onclick="showSurvey(${index})">查看</button>
    <button class="btn btn-primary btn-sm" id="edit" onclick="editSurvey(${index})">编辑</button>
    <button class="btn btn-primary btn-sm" id="publish" onclick="publishSurvey(${index})">发布</button> 
    <button class="btn btn-primary btn-sm" onclick="deleteSurvey(${index})">删除</button>
    <button class="btn btn-primary btn-sm" id="write" onclick="Write(${index})" disabled>填写</button>
    <button class="btn btn-primary btn-sm" id="analysis" onclick="showAnalysis(${index})" disabled>分析</button>
  `;
        }
        // 将问卷标题和信息元素添加到问卷容器元素中
        surveyContainer.appendChild(infoElement);

        // 将问卷容器元素添加到问卷列表容器元素中
        surveyList.appendChild(surveyContainer);
    });

    // 在全选按钮后面插入全选复选框和删除问卷按钮
    const checkall = document.getElementById('check-all');
    checkall.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" name="all" id="quanxuan" onclick="checkallSurvey()">
                <span class="quan">全选</span>
        </input>
                <button id="delete-all" disabled onclick="deletesuoyou()">删除问卷</button>
            `
    );
}



// 调用 displaySurveys() 函数显示问卷数据
displaySurveys();

//全选
function checkallSurvey() {
    //获取所有复选框
    //获取全选按钮的对象
    let check = document.getElementsByName("check");
    let all = document.getElementById("quanxuan");
    //获取全选按钮状态
    let tai = all.checked;
    //全部改变状态
    for (var i = 0; i < check.length; i++) {
        check[i].checked = tai;
    }
    document.getElementById("delete-all").disabled = !tai;
}

//批量
function turn() {
    //获取全部按钮的对象
    let check = document.getElementsByName("check");
    let all = document.getElementById("quanxuan");
    //记录所有按钮的状态 true--没有选
    let zhuang = true;
    //记录选了多少题
    let number = 0;
    for (var i = 0; i < check.length; i++)
        if (check[i].checked == true) {
            number++;
            zhuang = false;
        }
    document.getElementById("delete-all").disabled = zhuang;
    //动态改变 全选
    if (number < check.length)
        all.checked = false;
    else if (number == check.length)
        all.checked = true;
}

function deletesuoyou() {
    //获取全部按钮的对象
    let check = document.getElementsByName("check");
    let sure = confirm("您是否要删除已勾选问卷");
    if (sure === true) {
        //记录题目位置
        let ti = 0;
        for (let i = 0; i < check.length; i++) {
            //判断是否勾选,并删除勾选项
            if (check[i].checked) {
                //首先,要读取本地的数据,并存放到 数组surveys和data中
                const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
                const data = JSON.parse(localStorage.getItem('data')) || [];
                const graphData = JSON.parse(localStorage.getItem('graphData')) || [];
                //然后,删除本地的 标号为 ti 的问卷数据
                surveys.splice(ti, 1);
                data.splice(ti, 1);
                graphData.splice(ti, 1);
                //把改完的数组重新写入本地
                localStorage.setItem('surveys', JSON.stringify(surveys));
                localStorage.setItem('data', JSON.stringify(data));
                localStorage.setItem('graphData', JSON.stringify(graphData));
            }
            else
                ti++;
        }
        //刷新页面
        location.reload();
    }
}
