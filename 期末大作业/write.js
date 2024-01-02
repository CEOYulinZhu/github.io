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
function writeHomeBack() {
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
        <input type="${tempCurrentQuestionType === 'single' ? 'radio' : 'checkbox'}" name="dan">
        <span class="optionCount" id="option-count-${optionIndex + 1}">${String.fromCharCode(65 + optionIndex)}.</span>
        <input type="text" placeholder="输入选项内容" class="optiontext" disabled>
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
                
                    <input type="${questionType === 'single' ? 'radio' : 'checkbox'}" name="dan">
                    <span class="optionCount" id="option-count-${++optionCount}">${letter}.</span>
                   <input class="optiontext" type="text" placeholder="输入选项内容" disabled>
                
                
            </div>
        `).join('');
    } else {

        return `<textarea class="wenbenyu" id="text-${questionCount}" rows="8" cols="100"></textarea>`;  // 文本题
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
//上面是读取问卷



//下面是问卷保存
judgeIsWrite = 0;
function Write() {
    let isSurveyComplete = true;
    judgeIsWrite++;
    // 创建一个对象，用于存储问卷
    const surveyData = [];

    // 遍历问题，将问题标题、选项和类型存储到对象中
    for (let i = 1; i <= questionCount; i++) {
        const questionType = document.getElementById(`question-${i}`).name;
        const options = [];
        const questionTitle = document.getElementById(`question-${i}`).value;
        let text = '';

        // 如果问题有选项，则获取选项内容

        if (questionType != "text") {

            const optionsDiv = document.getElementById(`options-${i}`);
            const optionInputs = optionsDiv.getElementsByTagName('input');

            // 遍历选项，将选项内容和是否被选中存储到对象中
            for (let j = 0; j < optionInputs.length; j += 2) {
                options.push({
                    content: optionInputs[j + 1].value,
                    selected: optionInputs[j].checked
                });
            }
            if (options.every(option => !option.selected)) {
                isSurveyComplete = false;
            }
        }
        else {
            // questionType="123123";
            // text=document.getElementById(`text-${i}`).value;
            text = document.getElementById(`text-${i}`).value.trim();
            if (text == '')
                isSurveyComplete = false;
        }
        if (isSurveyComplete == false)
            break;

        // 将问题选项和类型存储到对象中
        surveyData.push({
            type: questionType,
            title: questionTitle,
            options: options,
            text: text
        });
    }

    // 判断是否所有问题都已回答


    if (isSurveyComplete) {
        alert("问卷已提交！");
        // 将数据存储在localStorage中
        const data = JSON.parse(localStorage.getItem('data')) || [];
        if (!data[Index])
            data[Index] = [];
        // surveyData.title=data[Index].length+1;
        data[Index].push([surveyData]);
        localStorage.setItem('data', JSON.stringify(data));
        window.location.href = "management.html";
        saveGraphData();
        readWrite();
    }
    else {
        alert("请回答所有问题！");
    }
    saveGraphData();
}

// 读取问卷数据
function readWrite() {
    // 从本地存储中获取问卷数据
    const writes = JSON.parse(localStorage.getItem('data')) || [];
    // 遍历问卷数据并输出
    writes.forEach((writeData, index) => {//每份问卷
        console.log(`问卷 ${index + 1}:`);
        writeData.forEach((surveyData, surveyindex) => {
            console.log(`第 ${surveyindex + 1} 次回答`);

            surveyData.forEach((question, questionIndex) => {
                question.forEach((qu, quIndex) => {
                    console.log(`问题 ${quIndex + 1}:${qu.title}`);
                    if (qu.type != "text") {
                        // console.log('选项:'$(options.length()));

                        qu.options.forEach((op, opIndex) => {
                            //  console.log(`选项 ${opIndex + 1}:`);
                            let number = opIndex + 1;
                            let letter = String.fromCharCode(64 + number);
                            console.log(`选项: ${letter}`);
                            console.log(`是否被选中: ${op.selected}`);
                        });
                        console.log('----------------------');
                    }
                    else {
                        console.log(`回答：${qu.text}`);
                        console.log('----------------------');
                    }
                })
            });
            console.log('======================');
        });
    });
}
readWrite();

function saveGraphData() {
    // 从本地存储中获取问卷数据
    const writes = JSON.parse(localStorage.getItem('data')) || [];

    const GraphData = [];
    // 遍历问卷数据并输出
    let choiceCount = Array.from({ length: 50 }).map(
        () => Array.from({ length: 20 }).fill(0)
    );
    writes[Index].forEach((surveyData, surveyindex) => {
        console.log('======================');
        surveyData.forEach((question, questionIndex) => {
            question.forEach((qu, quIndex) => {
                if (qu.type != "text") {
                    qu.options.forEach((op, opIndex) => {
                        if (`${op.selected}` === 'true') {
                            choiceCount[quIndex][opIndex]++;
                        }
                    });
                } else {
                    if (`${qu.text}` !== '') {
                        choiceCount[quIndex][0]++;
                    } else {
                        choiceCount[quIndex][1]++;
                    }
                }
            });
        });
    });
    writes[Index].some((surveyData, surveyIndex) => {
        return surveyData.some((question, questionIndex) => {
            return question.some((qu, quIndex) => {
                const option = [];
                if (qu.type !== "text") {
                    qu.options.forEach((op, opIndex) => {
                        option.push({
                            count: choiceCount[quIndex][opIndex],
                        });
                    });
                } else {
                    option.push({
                        count: choiceCount[quIndex][0],
                    });
                    option.push({
                        count: choiceCount[quIndex][1],
                    });
                }
                GraphData.push({
                    type: qu.type,
                    option: option,
                });

                // 在这里添加你的条件来终止外部循环
                if (quIndex >= question.length - 1) {
                    return true; // 返回 true 来停止外部循环
                }
                return false;
            });
        });
    });
    let indexnumber = JSON.parse(localStorage.getItem('index'));
    // 将数据存储在localStorage中
    const graphData = JSON.parse(localStorage.getItem('graphData')) || [];
    if (!graphData[Index]) {
        graphData[Index] = [];
    }
    graphData[Index].push([GraphData]);
    //删除原出于0位置的内容,并替换  //按钮要传序号过来
    graphData.splice(indexnumber, 1, GraphData);
    localStorage.setItem('graphData', JSON.stringify(graphData));
}