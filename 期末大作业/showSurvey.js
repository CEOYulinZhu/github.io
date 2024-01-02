let currentQuestionType = 'single';
let questionCount = 0;//问题计数器

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
//点击返回。跳转到management.HTML页面
function checkHomeBack() {
    window.location.href = "management.html"
}

// 显示视频弹出框
function showVideo() {
    document.getElementById('videoOverlay').style.display = 'flex';
}

// 隐藏视频弹出框
function hideVideo() {
    document.getElementById('videoOverlay').style.display = 'none';
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
        <span class="optionCount" id="option-count-${optionIndex + 1}">${String.fromCharCode(65 + optionIndex)}.</span>
        <input type="text"  class="optiontext" disabled>
    `;
    if (optionIndex < 2) {
        optionLabel.querySelector('input').setAttribute('disabled', 'disabled');
    }

    optionsDiv.appendChild(optionLabel);
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
                
                    
                    <span class="optionCount" id="option-count-${++optionCount}">${letter}.</span>
                   <input class="optiontext" type="text" disabled>
            </div>
        `).join('');
    } else {
        return '';  // 文本题
    }
}

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
           
            <!-- 根据问题类型，添加问题的默认样式，如单选四个、多选四个选项 -->
                <div id="options-${questionCount}" class="option">
                <!-- 选项将在这里动态添加 -->
                ${renderOptions(currentQuestionType)}
                </div>
        `;

    // 将所创建div元素放进questions元素中
    questionsDiv.appendChild(questionDiv);
    // updateQuestionCount();  // 添加问题后更新问题计数
    //changeButtonColor("");//恢复问题按钮的颜色
}

//读取本地数据
const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
const Index = JSON.parse(localStorage.getItem('index'));

// 遍历问卷数据并输出
surveys.forEach((surveyData, index) => {
    if (Index === index) {
        //本地的标题
        let title = `${surveyData.title}`;
        document.getElementById('survey-title').innerHTML = title;


        surveyData.questions.forEach((question, questionIndex) => {
            //本地的标题
            let questiontitle = `${question.title}`;
            //本地的类型
            let questiontype = `${question.type}`;

            //自动添加题目
            if (questiontype == "single") {
                currentQuestionType = 'single';
                addQuestion();
                document.getElementById(`question-${questionCount}`).value = questiontitle;
            }
            else if (questiontype == "multiple") {
                currentQuestionType = 'multiple';
                addQuestion();
                document.getElementById(`question-${questionCount}`).value = questiontitle;
            }
            else if (questiontype == "text") {
                currentQuestionType = 'text';
                addQuestion();
                document.getElementById(`question-${questionCount}`).value = questiontitle;
            }
            document.getElementById(`question-${questionCount}`).disabled = true;

            //选择题
            if (question.options.length > 0) {
                let father = document.getElementById(`options-${questionCount}`)
                let optionsDiv = father.querySelectorAll(".optiontext");
                //选项少于4
                if (question.options.length < 4) {
                    //删除剩余选项
                    for (let i = question.options.length; i < 4; i++) {
                        optionsDiv[i].parentElement.remove();
                    }
                }
                //选项大于4
                if (question.options.length > 4) {
                    //添加其余选项
                    for (let i = 3; i < question.options.length - 1; i++) {
                        addOption(father, questiontype);
                    }
                }
                //刷新一下optionsDIV的值
                optionsDiv = father.querySelectorAll(".optiontext");
                //给选项添加内容    
                question.options.forEach((option, optionIndex) => {
                    //选项内容: 
                    let xuan = `${option.content}`;
                    optionsDiv[optionIndex].value = xuan;
                });
            }
        });
    }
});


