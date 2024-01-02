// x 为要删除的题目序号
function deleteSurvey(x){
    let sure = confirm("您是否要删除此问卷");
    if(sure===true){
        //首先,要读取本地的数据,并存放到 数组surveys和data中
        const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
        const data = JSON.parse(localStorage.getItem('data')) || [];
        const graphData = JSON.parse(localStorage.getItem('graphData')) || [];
        //然后,删除本地的 标号为x 的问卷数据
        surveys.splice(x,1);
        data.splice(x,1);
        graphData.splice(x,1);
        //把改完的数组重新写入本地
        localStorage.setItem('surveys', JSON.stringify(surveys));
        localStorage.setItem('data', JSON.stringify(data));
        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert("问卷"+x+"已删除！");
        //刷新页面
        location.reload();
    }
    else
        alert("取消删除");
}