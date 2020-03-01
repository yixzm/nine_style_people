/**
* 九型人格测试（144题评定版开源代码）
* 
* 【版权声明】
* 禁止用于商业用途，如需作商业用途，请务必与素材资源的原作者联系，否则责任自负。
* 
* @author: yixzm
* @mail:   dream@yixzm.cn
* @site:   http://www.yixzm.cn
* @blog:
* 
* 源码讲解：https://blog.csdn.net/dreamstone_xiaoqw/article/details/90046498
* 原版说明：https://blog.csdn.net/dreamstone_xiaoqw/article/details/83903609
*/
var g_q_count = 144;
var g_qid = 0;
var g_answer = Array();
var api_host = "/nine_style_people/public/index.php";

/**
 * 
 * @author yixzm <dream@yixzm.cn> 
 * @description home.js, for /app/welcom/view/homme.html
 */
function $(id) {
    return document.getElementById(id);
}

function $$(className) {
    return document.getElementsByClassName(className);
}

function ajax(req, uri, func, body) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //TODO response增加鉴权code
            func(xmlhttp.responseText);
        }
    }
    //uri增加Code字段
    xmlhttp.open(req, uri, true);
    if (req == "POST") {
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    xmlhttp.send(body);
}

if ($("copyright")) {
    var uri = "http://www.yixzm.cn//welcom/api/load_copyright";
    ajax("GET", uri, function (response) {
        $("copyright").innerHTML = response;
    }, null);
}


/** ABC-DEF-GHI : 人格编码 963-142-857*/
var g_type = Array("和平", "忠诚", "成就", "完美", "自我", "助人", "领袖", "理智", "活跃");
/** 人格编码 963-142-857 ：对应命名下标 9-0,6-1,3-2,1-3,4-4,2-5,8-6,5-7,7-8*/
var g_typeID = Array(9, 6, 3, 1, 4, 2, 8, 5, 7);

function get_9style_people_question() {
    if (g_qid >= 0) {
        var uri = api_host + "?api=get_9style_people_question&qid=" + g_qid;
        ajax("GET", uri, case_get_9style_people_question, null);
    }
}

function get_9style_people_info(typeID) {
    var uri = api_host + "?api=get_9style_people_info&typeID=" + typeID;
    ajax("GET", uri, case_get_9style_people_info, null);
}

function post_9style_people_result() {
    var uri = api_host + "?api=post_9style_people_result";
    var jsonStr = encodeURIComponent(JSON.stringify(g_answer));
    var body = "result=" + jsonStr;
    //console.log(body);

    ajax("POST", uri, case_post_9style_people_result, body);
}

function case_get_9style_people_question(response) {
    // console.log(JSON.parse(response) );
    var question = (JSON.parse(response))[0].split(',');
    var process_value;
    $('question_board').innerHTML = '';
    var markCode = '\
    <div class="question">\
        <div class="btn radio" id="q_left"/>'+ question[0] + '</div>\
        <div class="btn radio" id="q_right"/>'+ question[1] + '</div>\
    </div>';
    $('question_number').innerHTML = '第 ' + (g_qid + 1) + ' 题';
    $('question_board').innerHTML = markCode;

    process_value = Math.floor(Number(g_qid % g_q_count));
    $('progress_bar').value = process_value;
    // console.log($('progress_bar').value);
    $('progress_bar').innerHTML = "<span id='progress_bar'>" + process_value + "</span>%";

    question_onclick();
}

function case_get_9style_people_info(response) {
    var info = (JSON.parse(response))[0];
    $('styleInfo').innerHTML = info;
}

function case_post_9style_people_result(response) {
    g_answer = (JSON.parse(response));
    // console.log(g_answer);
    var indexMax = 0;
    var valueMax = 0;
    for (i = 0; i < 9; i++) {
        var id = String.fromCharCode(65 + i); /** 'A'= */
        if (g_answer[id] > valueMax) {
            //console.log(id);
            valueMax = g_answer[id];
            //console.log(valueMax);
            indexMax = i;
        }
    }
    var style_type = g_type[indexMax];
    printRadar(style_type);
    get_9style_people_info(g_typeID[indexMax]);
}

function question_onclick() {
    $("q_left").onclick = function () {
        load_question(0);
    }

    $("q_right").onclick = function () {
        load_question(1);
    };
}

function load_question(score) {
    g_answer.push(score);
    ++g_qid;
    //console.log(g_qid+" : "+score);

    if (g_qid >= g_q_count) {
        $('progress_bar').value = $('progress_bar').value + 1;
        post_9style_people_result();
        $('stylePicture').style.display = "inline-block";
        $('styleInfo').style.display = "inline-block";
        $('msg_welcom').style.display = "none";
        $('msg_tip').style.display = "block";
        $('question_number').style.display = "none";
        $('question_board').style.display = "none";
    }
    else {
        get_9style_people_question();
    }
}

function reset_time(count) {
    // var timer = null;
    var second = 0;
    var minute = 0;
    var print = "";
    function count_down() {
        --count;
        if ((count < 0) || (g_qid > g_q_count)) {
            clearInterval(timer);
        }
        // console.log(count);
        second = count % 60;
        minute = Math.floor(count / 60);
        print = "剩余时间：" + minute + " 分钟 " + second + " 秒";
        console.log(print);
        $("timer").innerHTML = print;
    }
    timer = setInterval(count_down, 1000);
}

function style_people_init() {
    $('progress_bar').max = g_q_count;
    $('question_board').innerHTML = '<div class="btn" id="start_testing"> 开始测试... </div>';
    $('stylePicture').style.display = "none";
    $('styleInfo').style.display = "none";
    $('msg_welcom').style.display = "block";
    $('msg_tip').style.display = "none";
    $('question_number').style.display = "block";
    $('question_board').style.display = "block";
    $("start_testing").onclick = function () {
        $('start_testing').style.display = "none";
        $('question_board').style.textAlign = "left";
        reset_time(Number(45 * 60));
        get_9style_people_question();
    }
}

function printRadar(style_type) {
    var stylePicture = echarts.init(document.getElementById("stylePicture"));
    var limit = 20;

    var option = {
        backgroundColor: 'rgba(255,255,255,0.7 )',
        title: {
            text: style_type + "者",
            link: 'http://www.yixzm.cn',
            target: 'blank',
            top: '0.6%',
            left: '0.6%',
            textStyle: {
                color: '#000',
                fontSize: 20,
            }
        },

        radar: [{
            center: ['50%', '50%'],
            radius: 151,
            startAngle: 90,
            name: {
                formatter: '{value}',
                textStyle: {
                    fontSize: 15,
                    color: '#000'
                }
            },
            nameGap: 15,
            splitNumber: 4,
            shape: 'circle',
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    width: 1,
                    type: 'solid',
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#fff',
                    width: 2,
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
                }
            },
            indicator: [
                /** 人格编码 963-142-857 ：对应命名下标 9-0,6-1,3-2,1-3,4-4,2-5,8-6,5-7,7-8*/
                { name: g_type[3], max: limit }, { name: g_type[5], max: limit }, { name: g_type[2], max: limit },
                { name: g_type[4], max: limit }, { name: g_type[7], max: limit }, { name: g_type[1], max: limit },
                { name: g_type[8], max: limit }, { name: g_type[6], max: limit }, { name: g_type[0], max: limit }
            ]
        }],
        series: [{
            name: '雷达图',
            type: 'radar',
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1
                    },
                    opacity: 0.2
                },
                emphasis: {
                    lineStyle: {
                        width: 2.5
                    },
                    opacity: 0.5
                }
            },
            data: [{
                name: '九型分析结果',
                value: [
                    g_answer['D'], g_answer['F'], g_answer['C'],
                    g_answer['E'], g_answer['H'], g_answer['B'],
                    g_answer['I'], g_answer['G'], g_answer['A']
                ],
                symbol: 'circle',
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(51,0,255,1)',
                        borderWidth: 3,
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(51,0,255,0.5)'
                    }
                }
            }]
        },]
    };

    stylePicture.setOption(option);
}

style_people_init();
