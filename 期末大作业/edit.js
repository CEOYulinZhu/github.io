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
// 显示视频弹出框
function showVideo() {
    document.getElementById('videoOverlay').style.display = 'flex';
}

// 隐藏视频弹出框
function hideVideo() {
    document.getElementById('videoOverlay').style.display = 'none';
}
// 游戏规则部分↑


// 点击按钮时改变按钮的背景颜色
function changeButtonColor(buttonId) {
    // 恢复所有按钮的默认背景颜色，当用户点击“添加问题”的按钮时候
    document.getElementById("singleQuestionButton").style.backgroundColor = "";
    document.getElementById("multipleQuestionButton").style.backgroundColor = "";
    document.getElementById("textQuestionButton").style.backgroundColor = "";

    // 设置被点击按钮的背景颜色
    document.getElementById(buttonId).style.backgroundColor = "lightblue";
}

let currentQuestionType = 'single';//题目类型

// 判断用户选择的题目类型，并进行按钮背景颜色的改变
function changeQuestionType(type) {
    // 把用户选择的题目类型的值赋给currentQuestionType，方便后续使用
    currentQuestionType = type;
    switch (type) {
        case "single":
            changeButtonColor("singleQuestionButton");
            break;
        case "multiple":
            changeButtonColor("multipleQuestionButton");
            break;
        case "text":
            changeButtonColor("textQuestionButton");
            break;
        default:
            break;
    }
}

// 获取addQuestion元素
let addQuestionButton = document.querySelector('.addQuestion');
// 获取question-type-options元素
let questionTypeOptions = document.getElementById('question-type-options');







// 更新题目序号
function updateQuestionCount() {
    // 获取questions元素
    const questionsDiv = document.getElementById('questions');
    //获取questions元素内的question元素
    const questionContainers = questionsDiv.getElementsByClassName('question');

    // 遍历每个问题，获取前面序号的元素
    for (let i = 0; i < questionContainers.length; i++) {
        const questionContainer = questionContainers[i];
        questionContainer.id = `question-container-${i + 1}`;
        const option = questionContainer.querySelector('div[id^="options-"]');
        //    装有每个问题序号的容器
        const questionCountSpan = questionContainer.querySelector('span[id^="question-count-"]');
        const questionInput = questionContainer.querySelector('input[id^="question-"]');
        // 更新问题计数
        if (questionCountSpan) {
            questionCountSpan.textContent = `${i + 1}.`;
            questionCountSpan.id = `question-count-${i + 1}`;
        }
        if (questionInput) {
            questionInput.id = `question-${i + 1}`;
        }
        if (option) {
            option.id = `options-${i + 1}`;
        }
    }
}


let questionCount = 0;//问题计数器
function addQuestion() {
    const tempCurrentQuestionType = currentQuestionType;
    // 创建问题，问题数+1
    questionCount++;
    // 获取questions元素，因为在该元素内动态添加问题
    const questionsDiv = document.getElementById('questions');
    //在questions元素内创建div元素
    const questionDiv = document.createElement('div');
    //给一个类名，方便后续使用，这里对每个问题元素的类名都是这样的
    questionDiv.className = 'question';
    //给一个唯一的id
    questionDiv.id = `question-container-${questionCount}`;
    // 在创建的div元素内置HTML元素
    questionDiv.innerHTML = `
             <!-- 问题序号 -->
            <span class="questionCount" id="question-count-${questionCount}">${questionCount}.</span>
            <!-- 问题标题 -->
            <input type="text" class="singleQuestion" id="question-${questionCount}" name="${tempCurrentQuestionType}" placeholder="输入问题标题">
            <!-- 问题后面的按钮 -->
            <button onclick="deleteQuestion(this)">删除问题</button>
            ${
        //如果问题类型不是text,则才添加"添加选项"按钮 用?:语句
        currentQuestionType !== 'text'
            ? `<button onclick="addOption(this, '${tempCurrentQuestionType}')">添加选项</button>`
            : ''
        }
            <button onclick="moveUp(this)">上移</button>
            <button onclick="moveDown(this)">下移</button>
            <!-- 根据问题类型，添加问题的默认样式，如单选四个、多选四个选项 -->
                <div id="options-${questionCount}" class="option">
                <!-- 选项将在这里动态添加 -->
                ${renderOptions(currentQuestionType)}
                </div>
        `;

    // 将所创建div元素放进questions元素中
    questionsDiv.appendChild(questionDiv);
    updateQuestionCount();  // 添加问题后更新问题计数
    // changeButtonColor("");//恢复问题按钮的颜色
}

function deleteQuestion(button) {
    // const questionDiv = document.getElementById(`questions`).children[questionNumber-1];
    button.parentElement.remove();//删除问题
    questionCount--;//问题计数减一
    updateQuestionCount();  // 删除问题后更新问题计数

}


//添加默认问题：单选四个选项，多选四个选项，文本框一个
function renderOptions(questionType) {
    // 单选题和多选题需要添加选项
    if (questionType === 'single' || questionType === 'multiple') {
        const optionLetters = ['A', 'B', 'C', 'D'];
        let optionCount = 0;//选项数量，默认四个选项
        //  根据问题类型生成一组选项的 HTML 内容，并且为每个选项附加删除选项的功能
        //  然后通过join将所生成的选项 HTML 内容拼接成一个字符串，返回
        // 用map遍历optionLetters每一个选项，并为每个选项添加相同的内容
        //letter表示当前选项的字母
        return optionLetters.map((letter, _index) => `
            <div class="option-item" id="option-item">
                
                    <input type="${questionType === 'single' ? 'radio' : 'checkbox'}" name="dan">
                    <span class="optionCount" id="option-count-${++optionCount}">${letter}.</span>
                   <input type="text" placeholder="输入选项内容">
                
                <button onclick="deleteOption(this)">删除选项</button>
            </div>
        `).join('');
    } else {
        return '';  // 文本题
    }
}

// 更新选项序号
function updateOption(optionsDiv) {
    // 获取选项数量
    const optionCount = optionsDiv.children.length;
    // 获取所有选项标识元素
    const optionLabels = optionsDiv.querySelectorAll('.optionCount');
    // 循环更新选项标识
    for (let i = 0; i < optionCount; i++) {
        optionLabels[i].textContent = String.fromCharCode(65 + i) + '.';
        // 更新选项id
        optionLabels[i].id = `option-count-${i + 1}`;
    }
}


// 添加选项
function addOption(button, tempCurrentQuestionType) {
    // 获取该按钮的父元素中的.option类
    const optionsDiv = button.parentNode.querySelector('.option');
    //选项长度，方便修改后续增加选项的id
    const optionIndex = optionsDiv.children.length;

    const optionLabel = document.createElement('div');
    optionLabel.className = 'option-item';
    optionLabel.id = 'option-item';
    optionLabel.innerHTML = `
        <input type="${tempCurrentQuestionType === 'single' ? 'radio' : 'checkbox'}" name="dan">
        <span class="optionCount" id="option-count-${optionIndex + 1}">${String.fromCharCode(65 + optionIndex)}.</span>
        <input type="text" placeholder="输入选项内容">
        <button onclick="deleteOption(this)">删除选项</button>
    `;
    if (optionIndex < 2) {
        optionLabel.querySelector('input').setAttribute('disabled', 'disabled');
    }

    optionsDiv.appendChild(optionLabel);
    updateOption(optionsDiv);
}


// 删除选项
function deleteOption(button) {
    const optionsDiv = button.parentNode.parentNode;
    button.parentElement.remove();
    updateOption(optionsDiv);

}


//上移
function moveUp(button) {
    const questionDiv = button.parentNode;
    const previousQuestionDiv = questionDiv.previousElementSibling;
    // 把questionDiv元素插入到previousQuestionDiv元素之前
    document.getElementById(`questions`).insertBefore(questionDiv, previousQuestionDiv);
    //更新题目序号
    updateQuestionCount();
}

//下移
function moveDown(button) {
    const questionDiv = button.parentNode;
    const nextQuestionDiv = questionDiv.nextElementSibling;
    // 把下一个元素插入到questionDiv之前
    document.getElementById(`questions`).insertBefore(nextQuestionDiv, questionDiv);
    // 更新题目序号
    updateQuestionCount();
}

let judgeIsSave = 0;
// 数据存储部分
function saveSurvey() {

    judgeIsSave++;
    // 创建一个对象，用于存储问卷数据
    const surveyData = {
        title: document.getElementById('survey-title').textContent,
        questions: [],
        deadline: document.getElementById('deadline').value,
        time: new Date().toLocaleString() // 存储当前时间
    };

    // 遍历问题，将问题标题、选项和类型存储到对象中
    for (let i = 1; i <= questionCount; i++) {
        const questionTitle = document.getElementById(`question-${i}`).value;
        const questionType = document.getElementById(`question-${i}`).name;
        const options = [];

        // 如果问题有选项，则获取选项内容
        if (document.getElementById(`options-${i}`)) {
            const optionsDiv = document.getElementById(`options-${i}`);
            const optionInputs = optionsDiv.getElementsByTagName('input');

            // 遍历选项，将选项内容和是否被选中存储到对象中
            for (let j = 0; j < optionInputs.length; j += 2) {
                options.push({
                    content: optionInputs[j + 1].value,
                    selected: optionInputs[j].checked
                });
            }
        }

        // 将问题标题、选项和类型存储到对象中
        surveyData.questions.push({
            title: questionTitle,
            type: questionType,
            options: options
        });
    }

    // 将数据存储在localStorage中
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(surveyData);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    const ThisSurveyData = surveys[surveys.length - 1];
    ThisSurveyData.isPublished = false;
    localStorage.setItem('surveys', JSON.stringify(surveys));
    alert("问卷已保存！");
}



// 发布问卷
function publishSurvey() {
    // 获取当前时间
    const currentTime = new Date().toLocaleString();

    // 从本地存储中获取问卷数据
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

    // 检查问卷索引是否有效
    if (judgeIsSave) {
        // 更新问卷数据的发布时间和发布状态
        const surveyData = surveys[surveys.length - 1];
        surveyData.publishTime = currentTime;
        surveyData.isPublished = true;

        // 将更新后的问卷数据重新存储到本地存储中
        localStorage.setItem('surveys', JSON.stringify(surveys));

        alert("发布成功！");
    }
    else {
        alert("请先保存问卷再发布");
    }
}

// 读取问卷数据
function readSurvey() {
    // 从本地存储中获取问卷数据
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

    // 遍历问卷数据并输出
    surveys.forEach((surveyData, index) => {
        console.log(`问卷 ${index + 1}:`);
        console.log(`标题: ${surveyData.title}`);

        surveyData.questions.forEach((question, questionIndex) => {
            console.log(`问题 ${questionIndex + 1}:`);
            console.log(`标题: ${question.title}`);
            console.log(`类型: ${question.type}`);

            if (question.options.length > 0) {
                console.log('选项:');
                question.options.forEach((option, optionIndex) => {
                    console.log(`选项 ${optionIndex + 1}:`);
                    console.log(`内容: ${option.content}`);
                    console.log(`是否被选中: ${option.selected}`);
                });
            } else {
                console.log('此问题没有选项');
            }

            console.log('----------------------');
        });
        console.log(`创建时间: ${surveyData.time}`); // 输出保存数据的时间
        console.log(`截止日期: ${surveyData.deadline}`);
        console.log(`发布时间: ${surveyData.publishTime}`); // 输出发布时间
        console.log(`发布状态: ${surveyData.isPublished ? "已发布" : "未发布"}`); // 输出发布状态
        console.log('======================');
    });
}




// 输出问卷数据
readSurvey();
