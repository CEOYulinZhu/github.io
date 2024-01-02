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
function publishHomeBack() {
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

let currentOutDiv;
let Graphquestion;
function addQuestion() {
    const tempCurrentQuestionType = currentQuestionType;
    // 创建问题，问题数+1
    questionCount++;
    // 获取questions元素，因为在该元素内动态添加问题
    const questionsDiv = document.getElementById('questions');
    //在questions元素内创建div元素
    const questionDiv = document.createElement('div');
    Graphquestion = document.createElement('div');
    Graphquestion.className = 'block';
    currentOutDiv = questionsDiv;
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
        `;
    // 将所创建div元素放进questions元素中
    Graphquestion.appendChild(questionDiv);
    questionsDiv.appendChild(Graphquestion);
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


            //添加图表区域
            const graphDiv = document.createElement('div');
            graphDiv.className = 'graph'
            graphDiv.id = `Graph-container-${questionCount - 1}`;
            Graphquestion.appendChild(graphDiv);
        });
    }
});
//上面是读取问卷


//从这里开始分三步
//第一步 读取数据并且整理数据
//第二步 写入整理好的数据
//第三步 读取整理好的数据并且生成图表



const graphData = JSON.parse(localStorage.getItem('graphData')) || [];
let graphQuestionIndex = 0;
let graphOptionCount = 0;


function addGraph(graphCount, graphElement) {
    // 获取graph元素，因为在该元素内动态添加问题
    const graphsDiv = document.getElementById('graph');
    //在graph元素内创建div元素
    const graphDiv = document.createElement('div');
    //给一个类名，方便后续使用，这里对每个问题元素的类名都是这样的
    graphDiv.className = 'questionGraph';
    //给一个唯一的id
    graphDiv.id = `Graph-container-${graphQuestionIndex}`;
    // 在创建的div元素内置HTML元素
    graphDiv.innerHTML = `
                <div id="Graph-${graphQuestionIndex}" class="graph">
        `;

    // 基于准备好的dom，初始化echarts实例

    let graphName;
    if (currentQuestionType === "single") {
        graphName = "单选题";
    } else if (currentQuestionType === "multiple") {
        graphName = "多选题";
    } else {
        graphName = "文本题";
    }

    var questionChart = echarts.init(document.getElementById(`Graph-container-${graphQuestionIndex}`));

    // 指定图表的配置项和数据
    if (currentQuestionType !== "multiple") {
        var option = {
            title: {
                text: `${graphName}`
            },
            tooltip: {},
            xAxis: {
                data: graphElement
            },
            yAxis: {},
            series: [
                {
                    name: '选择',
                    type: 'bar',
                    data: graphCount
                }
            ]
        };
    } else {
        option = {
            title: {
                text: `${graphName}`
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '选择',
                    type: 'pie',
                    radius: '50%',
                    data: graphElement,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    // 使用刚指定的配置项和数据显示图表。
    questionChart.setOption(option);
}

function printGrapg() {
    graphData.forEach((graph, graphIndex) => {
        if (Index == graphIndex) {
            graph.forEach((question, questionIndex) => {
                //本地的选项
                let questionOption = `${question.option}`;
                //本地的类型
                let questiontype = `${question.type}`;

                graphOptionCount = question.length;
                graphQuestionIndex = questionIndex;

                const graphCount = [];
                question.option.forEach((option, optionIndex) => {
                    graphCount[optionIndex] = option.count;
                })

                //自动添加题目
                if (questiontype == "single") {
                    currentQuestionType = 'single';
                    const graphElement = [];
                    question.option.forEach((option, optionIndex) => {
                        graphElement[optionIndex] = `${String.fromCharCode(65 + optionIndex)}`;
                    })
                    addGraph(graphCount, graphElement);
                }
                else if (questiontype == "multiple") {
                    currentQuestionType = 'multiple';
                    const graphElement = [];
                    question.option.forEach((option, optionIndex) => {
                        graphElement.push({
                            value: graphCount[optionIndex],
                            name: `${String.fromCharCode(65 + optionIndex)}`
                        })
                    })
                    addGraph(graphCount, graphElement);
                }
                else if (questiontype == "text") {
                    const graphElement = [];
                    graphElement[0] = "有效回答";
                    graphElement[1] = "无效回答";
                    currentQuestionType = 'text';
                    addGraph(graphCount, graphElement);
                }
            })
        }
    })
}
window.onload = printGrapg();