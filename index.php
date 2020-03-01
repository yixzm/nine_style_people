<?php

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

function get_lib_path($mark)
{
    return "./db/" . $mark . ".php";
}

$api = isset($_GET['api']) ? $_GET['api'] : 'view';

switch ($api) {
    case "qi": {
            $qid = isset($_GET['qid']) ? (int) $_GET['qid'] : -1;
            if ($qid >= 0 && $qid < 144) {
                require_once(get_lib_path("question"));
                echo json_encode([$question[$_GET['qid']]], JSON_UNESCAPED_UNICODE);
            }
        }
        break;
    case "ii": {
            $typeID = isset($_GET['typeID']) ? (int) $_GET['typeID'] : -1;
            if ($typeID >= 0 && $typeID < 9) {
                require_once(get_lib_path("info"));
                echo json_encode([$question[$_GET['typeID']]], JSON_UNESCAPED_UNICODE);
            }
        }
        break;
    case "rm": {
            $result = isset($_POST['result']) ? $_POST['result'] : null;
            if ($result != null) {
                $response = json_decode($result);
                require_once(get_lib_path("answer"));
                $score = [
                    'A' => 0, 'B' => 0, 'C' => 0,
                    /** 9-6-3 */
                    'D' => 0, 'E' => 0, 'F' => 0,
                    /** 1-4-2 */
                    'G' => 0, 'H' => 0, 'I' => 0,
                    /** 8-5-7 */
                ];
                for ($i = 0; $i < count($response); $i++) {
                    ++$score[$answer[$i][$response[$i]]];
                }
                echo json_encode($score);
            }
        }
        break;
    default:
        require_once(__DIR__ . "/static/jx.html");
}
