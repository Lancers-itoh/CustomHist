//配列宣言などは関数の外でも可能だが、documentから要素を取得するには、イベントバンドラを利用しHTML側から呼び出す必要がある。
//関数の中で要素を取得する、あるいは、window.onload で取得。
var Data = new Array();
var Sample;
var Data_length;
var year_group = new Array();
var img_position = new Array();
var $img_div = new Array ();
var frame_in;
var interval_time = 2000;
var transition_time = 1000;
var tuned_position = 60;
var max_size = 0;
var is_first_time = true;
var encoder;
var RECORD_signal = false;

function func1() {
    if(max_size != 0){
        var input_message = document.getElementById("input_message").value;
        frame_in = parseInt(document.getElementById("input_message").value);
        var frame_out = Sample - frame_in;
        wrapper.style = "width:" + (20 + tuned_position*frame_out) + "px"
    }else{
        alert("csvを読み込ませてからこの設定を行ってください。")
    }
}

function func2() {
    interval_time = parseInt(document.getElementById("input_message2").value);
}

function func3() {
    transition_time = parseInt(document.getElementById("input_message3").value);
}


window.onload = function() {  

    
	var form = document.forms.myform;
    form.myfile.addEventListener( 'change', function(e) {
        var result = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText( result );
        reader.addEventListener( 'load', function() {
            var rowdata = reader.result.split('\n');
            Sample = rowdata.length - 1;
            var GIF_div = document.getElementById("GIF");
            var submax_size = new Array();

            for(let i=0; i < rowdata.length; i++){
                split_row = rowdata[i].split(',');
                if(i != 0){
                    num_arr = split_row.splice(3).map( str => parseInt(str, 10) );
                    submax = Math.max(...num_arr);
                    submax_size.push(submax);
                }
                Data.push(rowdata[i].split(','));
            }
            form.output.textContent = Data;
            max_size = Math.max(...submax_size);



            function arrange(i){
                var div = document.createElement('div');
                div.className = 'inline_block';
                div.id = ("img" + i);
                var p1 = document.createElement('p');
                p1.className = "label";
                p1.textContent = Data[i+1][1];
                var img = document.createElement('img');
                img.src = Data[i+1][0];
                img.style = "height: 45px;" ;
                img.className = "sample" ;
                var p2 = document.createElement('p');
                p2.className = "value";
                p2.textContent = Data[i+1][4];
                div.appendChild(p1);
                div.appendChild(img);
                div.appendChild(p2);
                GIF_div.appendChild(div);
            }
            for(var i=0; i < Sample; i++ ){
                arrange(i);
            }

            var $labels = document.getElementsByClassName('label');
            var $imgs = document.getElementsByClassName('sample');
            var $targetValues = document.getElementsByClassName('value');
            var wrapper = document.getElementById("wrapper");
            for(var i=0; i< $imgs.length; i++){
                var classname = "img" + i;
                $img_div[i] = document.getElementById(classname);
            }
            
            var elem = document.getElementById('range');
            var target = document.getElementById('value');
            var $title = document.getElementById('title');
            var $GIF_div = document.getElementById("GIF");
            var rangeValue = function (elem, target) {
              return function(evt){
                    tuned_position = elem.value;
                    var a = document.getElementById("slider_val");
                    console.log(a.className);
                    a.textContent = elem.value;
                    for(var i=0; i< $img_div.length; i++){
                        $img_div[i].style = 'width:' + tuned_position + "px";
                        $img_div[i].style = 'left:' + (20 + (tuned_position)*i ) + 'px';
                    }
                    console.log($img_div[0].className);
                    a = window.getComputedStyle($img_div[$img_div.length-1], null).getPropertyValue('left');
                    console.log(a);
                    $title.style = 'left:' + (parseInt(a) + 100) + 'px';
                    $GIF_div.style = 'width:' + (parseInt(a) + 200) + 'px';
              }
            }
            elem.addEventListener('input', rangeValue(elem, target));

            var elem2 = document.getElementById('range2');
            var wrapper = document.getElementById('wrapper');
            var rangeValue2 = function (elem2, target) {
              return function(evt){
                  console.log(elem2.value);
                    wrapper.style = 'width:' + elem2.value + 'px';
              }
            }
            elem2.addEventListener('input', rangeValue2(elem2, target));



           //初期設定
            Sample = $labels.length;
            Data_length = Data[0].length;


            var submax = new Array();
            for(var i=0; i < Sample; i++ ){
                $labels[i].textContent = Data[i+1][1];
                $imgs[i].className = (Data[i+1][2] + " sample");
                //$imgs[i].style = 'height:' + Data[i+1][3] +'px';
                $imgs[i].style = 'height:' + max_size +'px';
                //$img_div[i].style = 'left:' + img_position[rank_gen(2, i)];
                //$labels[i].style = 'bottom:' + (parseInt(Data[i+1][3])+ 10) + 'px';
                $labels[i].style = 'bottom:' + (max_size + 10) + 'px';
                $targetValues[i].textContent = Data[i+1][3];
            }
            
            function rank_gen(time, array_index){
		        var csv_array = new Array();
		        var csv_array_former = new Array();

		        for(var i=1; i <= Sample; i++){
		            csv_array.push(parseInt(Data[i][time]));
		        }
		        for(var i=1; i <= Sample; i++){
		            csv_array_former.push(parseInt(Data[i][time-1]));
		        }

		        var reference_value = csv_array[array_index];
                var sort_array = csv_array.slice().sort(compareFunc);
                
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
        })
    })
}

function record_do(){
    RECORD_signal = !RECORD_signal;
    if(RECORD_signal){
        value = "録画する";
    }else{
        value = "録画しない";
    }
    document.getElementById("record_value").textContent =  value;
}

function resize_play(){
    console.log(interval_time);
    disabledButtons( true );
    if(is_first_time){
        var $imgs = document.getElementsByClassName('sample');
        for(var i=0; i< $imgs.length; i++){
            var classname = "img" + i;
            $img_div[i] = document.getElementById(classname);
            var tar_pos = window.getComputedStyle($img_div[i], null).getPropertyValue('left');
            img_position.push(tar_pos);
        }
        is_first_time = false;
    }

    var $targetElements = document.getElementsByClassName('sample');
    var $targetValues = document.getElementsByClassName('value');
    var $title = document.getElementById('title');
    var $labels = document.getElementsByClassName('label');
    //希望繊維時間
    
    if(RECORD_signal){
        timelaps_interval = 1;
        End_time = (transition_time + interval_time)*(Data_length-3)+interval_time;
        screen_shot_execute(End_time);
    }
    for(var k=3; k < (Data_length); k++){
        setTimeout(animation, (transition_time + interval_time)*(k-3), k)
    }

    function screen_shot_execute(End_time){
        $ID = setInterval(function(){screen_shot()},timelaps_interval);
        setTimeout(clearInterval, End_time, $ID);
        var GIF_div = document.getElementById("GIF");
        var anime_section = document.getElementById("anime")
        function screen_shot(){
            var img = document.createElement('img');
            anime_section.appendChild(img);
            //ボタンを押下した際にダウンロードする画像を作る
            html2canvas(GIF_div,{
                onrendered: function(canvas){
                //aタグのhrefにキャプチャ画像のURLを設定
                var imgData = canvas.toDataURL();
                //var img_folder = document.getElementById('img_folder1');
                img.src = imgData;
                img.style = "width: 80px;"
                }
            });
        }
    }

    function animation(time){
        var $intervalID  =new Array();
        var speed = new Array();
        var $intervalID2  =new Array();
        var speed2 = new Array();

        //setInterval をforstatementで使うときは、変数iをクロージャでキープする( https://qiita.com/yam_ada/items/2867985bcb6b77288548 )
        for(var i=0; i < Sample; i++){
            speed[i] = speed_calc_expand(i, time);
            speed2 = 0.0001;
            (function(index) {
                $intervalID[index] = setInterval(function(){speed_manager_expand(index, time, $intervalID[index])},speed[index]);
            })(i);
            (function(index) {
                $intervalID2[index] = setInterval(function(){speed_manager_location(index, time, $intervalID2[index])},speed2);
            })(i);
            $title.textContent = Data[0][time];
        }
    }

    function speed_manager_expand(i, time, $ID){
        var value = Data[i+1][time];
        var height = parseInt($targetElements[i].style.height);
        if(height != value){
            switch(height > value){
                case true :
                    $targetElements[i].style.height = --height + 'px';
                    newheight =  parseInt($targetElements[i].style.height)+ 10;
                    $labels[i].style = 'bottom:' + newheight +'px';
                    $targetValues[i].textContent = height;
                    break;
                case false :
                    $targetElements[i].style.height = ++height + 'px';
                    newheight =  parseInt($targetElements[i].style.height)+ 10;
                    $labels[i].style = 'bottom:' + newheight +'px';
                    $targetValues[i].textContent = height;
                    break;
            }
        }else{
            clearInterval($ID);
        }
    }

    function speed_manager_location(i, time, $ID){
        var value = parseInt(img_position[rank_gen(time, i)]);
        var position = parseInt(window.getComputedStyle($img_div[i], null).getPropertyValue('left'));
        if(position != value){
            switch(position > value){
                case true :
                    $img_div[i].style.left  =  --position + 'px';
                    break;
                case false :
                    $img_div[i].style.left = ++position + 'px';
                    break;
            }
        }else{
            clearInterval($ID);
        }
    }

    
    function speed_calc_expand(i, $time){
        var value = Data[i+1][$time];
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

    function rank_gen(time, array_index){
        var csv_array = new Array();
        var csv_array_former = new Array();

        for(var i=1; i <= Sample; i++){
            csv_array.push(parseInt(Data[i][time]));
        }
        for(var i=1; i <= Sample; i++){
            csv_array_former.push(parseInt(Data[i][time-1]));
        }

        var reference_value = csv_array[array_index];
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
    disabledButtons( false );
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

function createGIF()
{
    //連番画像を重ねているだけなので、透過画像だと前後のコマが混同する。
    //canvasの取得
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    //GIFEncoderの初期処理
    encoder = new GIFEncoder();
    encoder.setRepeat(0); //繰り返し回数 0=無限ループ
    encoder.setDelay(document.getElementById('anime_speed').value); //1コマあたりの待機秒数（ミリ秒）
    encoder.start();
    //画像ファイル一覧を取得
    frames = document.getElementById('anime').getElementsByTagName('img');
    //canvasのサイズを1枚目のコマに合わせる
    canvas.width = frames[0].naturalWidth;
    canvas.height = frames[0].naturalHeight;
    //全ての画像をcanvasへ描画
    for (var frame_no = 0; frame_no < frames.length; frame_no++) {
        ctx.drawImage(frames[frame_no], 0, 0);
        encoder.addFrame(ctx); //コマ追加
    }
    //アニメGIFの生成
    encoder.finish();
    document.getElementById('anime_gif').src = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
    //ダウンロードボタンを表示
    document.getElementById('download').style.display = 'block';
}
function downloadGIF()
{
    encoder.download("download.gif");
}