//配列宣言などは関数の外でも可能だが、documentから要素を取得するには、イベントバンドラを利用しHTML側から呼び出す必要がある。
//関数の中で要素を取得する、あるいは、window.onload で取得。
var Data = new Array();
var NumberOfMoveImg;
var DataEndIndex;
var year_group = new Array();
var img_position = new Array();
var $img_div = new Array ();
var $moveimgs;
var number_of_frame_in = 10;
let interval_time = 2000;
let transition_time = 1000;
let MaxConstSize = 200;
var max_size = 0;
var is_first_time = true;
var encoder;
var RECORD_signal = false;
const MaxHeightIn = [];
var WperH_ratio;
var Data_in = [];
var distance_between_imgs = 20;

/*const は読み取り専用の変数として宣言する*/

function func1() {
    number_of_frame_in =  parseInt(document.getElementById("input_message1").value);
}

function func2() {
    interval_time = parseInt(document.getElementById("input_message2").value);
}

function func3() {
    transition_time = parseInt(document.getElementById("input_message3").value);
}


function func4() {
    $moveimgs = document.getElementsByClassName('moveimg');
    $labels = document.getElementsByClassName('label');
    MaxConstSize = parseInt(document.getElementById("input_message4").value);
    for(var i=0; i < NumberOfMoveImg; i++ ){
        $labels[i].textContent = Data[i+1][1];
        var Max  = MaxHeightIn[0];
        var value = (MaxConstSize/Max) * Data[i+1][3];
        $moveimgs[i].style = 'height:' + value +'px';
        //$img_div[i].style = 'left:' + img_position[rank_gen(2, i)];
        $labels[i].style = 'bottom:' + (value + 10) + 'px';
        //$labels[i].style = 'bottom:' + (max_size + 10) + 'px';
    }
}

function func5() {
    distance_between_imgs = parseInt(document.getElementById("input_message5").value);
    Initialization();
    function Initialization(){
        $moveimgs = document.getElementsByClassName('moveimg');
        $labels = document.getElementsByClassName('label');
        img_position = img_div_coordinate_in(3);
        for(var i=0; i < NumberOfMoveImg; i++ ){
            $labels[i].textContent = Data[i+1][1];
            var Max  = MaxHeightIn[0];
            var value = (MaxConstSize/Max) * Data[i+1][3];
            $moveimgs[i].style = 'height:' + value +'px';
            $img_div[i].style = 'left:' + img_position[rank_gen(3, i)] + 'px';
            $labels[i].style = 'bottom:' + (value + 10) + 'px';
        }
    }
}


//それぞれの時代の最大値を600pxほどでだす

window.onload = function() {  

    var form = document.forms.myform;

    form.myfile.addEventListener( 'change', function(e) {
        var result = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText( result );
        reader.addEventListener( 'load', function() {
            var rowdata = reader.result.split('\n');
            var GIF_div = document.getElementById("GIF");
            var submax_size = new Array();

            for(let i=0; i < rowdata.length; i++){
                var split_row = rowdata[i].split(',');
                if(i != 0){
                    num_arr = split_row.splice(3).map( str => parseInt(str, 10) );
                    submax = Math.max(...num_arr);
                    submax_size.push(submax);
                }
                Data.push(rowdata[i].split(','));
            }
            form.output.textContent = Data;
            max_size = Math.max(...submax_size);

            NumberOfMoveImg = rowdata.length - 1;
            //アニメーションで表示される画像の数 ヘッダ分の１つを除外している。
            DataEndIndex = Data[0].length;
            //アニメーションで表示される画像の数 ヘッダ分の１つを除外している。


            const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
            var transposed_array = transpose(Data);
            for(var i=3; i< DataEndIndex; i++){
                value_array = transposed_array[i].splice(1).map( str => parseInt(str, 10) );
                Data_in.push(value_array);
                MaxHeightIn.push(Math.max(...value_array));
            }

            /*フレームイン処理
            ordered_data = Data_in[0].slice().sort(compareFunc);
            frame_in_data = ordered_data.splice(ordered_data.length-number_of_frame_in);
            function compareFunc(a, b) {
                return a - b;
            }
            console.log(frame_in_data);*/
            
            function CreateMoveImgGroup(i){
                var div = document.createElement('div');
                div.className = 'inline_block';
                div.id = ("img" + i);
                var p1 = document.createElement('p');
                p1.className = "label";
                p1.textContent = Data[i+1][1];
                var img = document.createElement('img');
                img.src = Data[i+1][0];
                img.style = "height: 45px;" ;
                img.className = 'moveimg ' + Data[i+1][2];
                var p2 = document.createElement('p');
                p2.className = "value";
                p2.textContent = Data[i+1][4];
                div.appendChild(p1);
                div.appendChild(img);
                div.appendChild(p2);
                GIF_div.appendChild(div);
            }
            for(var i=0; i < NumberOfMoveImg; i++ ){
                CreateMoveImgGroup(i);
            }
            /*とりあえず作って、座標をフレームアウトさせる*/

        
            var $labels = document.getElementsByClassName('label');
            var $moveimgs = document.getElementsByTagName('img');
            var $targetValues = document.getElementsByClassName('value');
            for(var i=0; i< $moveimgs.length; i++){
                var classname = "img" + i;
                $img_div[i] = document.getElementById(classname);
            }

            /*縦横比の取得*/
            var element = $moveimgs[0];
            var intervalId = setInterval( function () {
                if ( element.complete ) {
                    var width = element.naturalWidth ;
                    var height = element.naturalHeight ;
                    WperH_ratio = width/height;
                    console.log(WperH_ratio);
                    clearInterval( intervalId ) ;
                }
            }, 500 ) ;
            
            var target = document.getElementById('value');
            var $title = document.getElementById('title');
            var $GIF_div = document.getElementById("GIF");
            
            /*縦横比を元に初期化*/
            var $intervalID2 = setInterval(initialization ,500);

            function initialization(){
                $moveimgs = document.getElementsByClassName('moveimg');
                $labels = document.getElementsByClassName('label');
                img_position = img_div_coordinate_in(3);
                for(var i=0; i < NumberOfMoveImg; i++ ){
                    $labels[i].textContent = Data[i+1][1];
                    var Max  = MaxHeightIn[0];
                    var value = (MaxConstSize/Max) * Data[i+1][3];
                    $moveimgs[i].style = 'height:' + value +'px';
                    $img_div[i].style = 'left:' + img_position[rank_gen(3, i)] + 'px';
                    $labels[i].style = 'bottom:' + (value + 10) + 'px';
                    //$labels[i].style = 'bottom:' + (max_size + 10) + 'px';
                    $targetValues[i].textContent = Data[i+1][3];
                    clearInterval( $intervalID2 );
                }
            }

        })
    })
}




function resize_play(){
    disabledButtons( true );

    //ここであらかじめ位置情報を記憶してるけどいらないかも
    if(is_first_time){
        var $moveimgs = document.getElementsByClassName('moveimg');
        for(var i=0; i< $moveimgs.length; i++){
            var classname = "img" + i;
            $img_div[i] = document.getElementById(classname);
            var tar_pos = window.getComputedStyle($img_div[i], null).getPropertyValue('left');
            img_position.push(tar_pos);
        }
        is_first_time = false;
    }

    var $targetElements = document.getElementsByClassName('moveimg');
    var $targetValues = document.getElementsByClassName('value');
    var $title = document.getElementById('title');
    var $labels = document.getElementsByClassName('label');
    
    
    for(var k=3; k < (DataEndIndex); k++){
        setTimeout(animation, (transition_time + interval_time)*(k-3), k)
    }

    function animation(time){
        var $intervalID  =new Array();
        var speed = new Array();
        var $intervalID2  =new Array();
        var $intervalID3  =new Array();
        var speed2 = new Array();
        var Max  = MaxHeightIn[time-3];
        var img_position = img_div_coordinate_in(time);

        //setInterval をforstatementで使うときは、変数iをクロージャでキープする( https://qiita.com/yam_ada/items/2867985bcb6b77288548 )
        
        for(var i=0; i < NumberOfMoveImg; i++){
            //speed[i] = speed_calc_expand(i, time);
             speed[i] = speed_calc_expand(i, time);
            //speed[i] = 10;
             speed2 = 1;

            (function(index) {
                $intervalID[index] = setInterval(function(){speed_manager_expand(index, time, $intervalID[index])},speed[index]);
            })(i);
            (function(index) {
                $intervalID2[index] = setInterval(function(){speed_manager_location(index, time, $intervalID2[index])},speed2);
            })(i);
            (function(index) {
                $intervalID3[index] = setInterval(function(){rewrite(index, time, $intervalID3[index])},100);
            })(i);
        }
        $title.textContent = Data[0][time];
        $title.style = "left:" + img_position[NumberOfMoveImg-1] + distance_between_imgs + "px";

        var v = 5;
        function speed_manager_expand(i, time, $ID){
            var value = Math.round((MaxConstSize/Max) * Data[i+1][time]);
            var height = parseInt($targetElements[i].style.height);
            if(height != value){
                switch(height > value){
                    case true :
                            if((height - value) >= v){
                                height = height - v;
                            }else{
                                height = height - 1;
                            }
                            $targetElements[i].style.height = height + 'px';
                            newheight =  parseInt($targetElements[i].style.height)+ 10;
                            $labels[i].style = 'bottom:' + newheight +'px';
                            //$targetValues[i].textContent = Math.round(height*Max/MaxConstSize);
                        break;
                    case false :
                        if((height - value) <= v){
                            height = height + v;
                        }else{
                            height = height + 1;
                        }
                        $targetElements[i].style.height = height + 'px';
                        newheight =  parseInt($targetElements[i].style.height)+ 10;
                        $labels[i].style = 'bottom:' + newheight +'px';
                        //$targetValues[i].textContent = Math.round(height*Max/MaxConstSize);
                        break;
                }
            }else{    
                $targetValues[i].textContent = Math.round(height*Max/MaxConstSize);
                clearInterval($ID);
            }
        }


    /*速さ*/
        
        function speed_manager_location(i, time, $ID){
            var value = Math.round(parseInt(img_position[rank_gen(time, i)]));
            var position = parseInt(window.getComputedStyle($img_div[i], null).getPropertyValue('left'));
            if(position != value){
                switch(position > value){
                    case true :
                        if((position - value) >= v){
                            position = position - v;
                        }else{
                            position = position - 1;
                        }
                        $img_div[i].style.left  =  position + 'px';
                        break;
                    case false :
                        if((position - value) <= v){
                            position = position + v;
                        }else{
                            position = position + 1;
                        }
                        $img_div[i].style.left = position + 'px';
                        break;
                }
            }else{
                clearInterval($ID);
            }
        }

        function rewrite(i, time, $ID){
            value = parseInt($targetValues[i].textContent);
            if(value  > Data[i+1][time]){
                switch(value > Data[i+1][time] ){
                    case true:
                        $targetValues[i].textContent = value--;
                        break;
                    case false:
                        $targetValues[i].textContent = value++;
                        break;
                }
            }else{
                clearInterval($ID);
            }
        }

        
        function speed_calc_expand(i, time){
            var Max  = MaxHeightIn[time-3];
            var value = Math.round((MaxConstSize/Max) * Data[i+1][time]);
            var height = parseInt($targetElements[i].style.height);
            var speed;
            if(Math.abs(value - height) != 0){
                speed = transition_time/Math.abs(value - height);
            }else{
                speed=0.0001;
            }
            if(speed >= transition_time*0.8){
                speed  = transition_time*0.6;
            }
            return(Math.round(speed));
        }
    }



    disabledButtons( false );
}

function rank_gen(time, array_index){

    //その年代における最適な座標を割り出す。

    var csv_array = new Array();
    var csv_array_former = new Array();

    for(var i=1; i <= NumberOfMoveImg; i++){
        csv_array.push(parseInt(Data[i][time]));
    }
    for(var i=1; i <= NumberOfMoveImg; i++){
        csv_array_former.push(parseInt(Data[i][time-1]));
    }

    var reference_value = csv_array[array_index];
    console.log(reference_value);
    var sort_array = csv_array.slice().sort(compareFunc);
    var former_sort_array = csv_array_former.slice().sort(compareFunc);

     //重複するデータを抽出
     //それに一致するデータは２つの可能性を提示　位置が近い方を採用
    function multi_indexOf(array, index){
        var count = new Array();
        for(var i=0; i< array.length; i++){
            if(index == array[i]){
                count.push(i);
            }
        }
        return(count);
     }

     var rank  = multi_indexOf(sort_array, reference_value);
     var result;
     if(rank.length >= 2){
         same_rank_csv_index  = multi_indexOf(csv_array, reference_value);
         tuned_index = multi_indexOf(same_rank_csv_index, array_index);
         result = rank[tuned_index];
     }else{
         result = rank;
     }

    function compareFunc(a, b) {
        return a - b;
    }
       return(result);
}


function img_div_coordinate_in(time){
    var this_time_position = [];
    data_in_this_time = Data_in[time-3].sort(compareFunc);
    left = 20;
    this_time_position.push(left);
    var Max = MaxHeightIn[time-3];
    /*最後はタイトル用の位置として取っておく*/
    //leftが指すものが中心である可能性があるので自分とformerのwidthの1/2の合計を加算する。
    for(var i=1; i< data_in_this_time.length; i++){      
        var former_value = Math.round((MaxConstSize/Max) * data_in_this_time[i-1]);
        var former_width = former_value*WperH_ratio;
        var self_value = Math.round((MaxConstSize/Max) * data_in_this_time[i]);
        var self_width = self_value*WperH_ratio;
        left = left + (former_width/2 + self_width/2) + distance_between_imgs;
        this_time_position.push(left);
    }

    function compareFunc(a, b) {
        return a - b;
    }
    return(this_time_position);
}

function disabledButtons( $disabled ) {
    $buttons = document.getElementById( "sampleButtons" ).getElementsByTagName( "button" );
    for( var $i = 0; $i < $buttons.length; $i++ ) {
        $buttons[$i].disabled = $disabled;
    }
}

/*window.onload = function(){
    var target = document.getElementById("GIF");
    var folder = document.getElementById("folder")
    var img1 = document.createElement('img');
    folder.appendChild(img1);
      //ボタンを押下した際にダウンロードする画像を作る
      html2canvas(target,{
        onrendered: function(canvas){
          //aタグのhrefにキャプチャ画像のURLを設定
          var imgData = canvas.toDataURL();
          //var img_folder = document.getElementById('img_folder1');
          img1.src = imgData;
          console.log(imgData);
        }
    });
}*/



