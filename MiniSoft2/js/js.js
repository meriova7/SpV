let levels = [[3,[{2:1}],0], [5, [{3:1}],0], [6,[{3:1},{4:1},{6:1}],0], [6,[{2:1}, {4:2}, {6:1}],0], [7,[],"3:1"], [8,[],"2-4:1"], [8,[],"2-4:2"], [8,[],"2:2,3:1"]]; //[pocet kopcekov, [index kopceku => pocet mrkiev], [interval random kopcekov] ]
var currentLevel = 0; // aktualny level
var countHill = 0; // pocet kopcov
var twoCarrots = false; // ci sa v hre nachadzaju 2 mrkvy
var oneCarrot = false; // ci sa v hre nachadzaju 2 mrkvy
var numPickCarrots = 0; //pocet pozbieranych mrkiev v animacii
var firstInsert = false;
var scene = [];
var randomNumbers = [];
var result = 0;
var play = false;
var count = 0;

function drawScene(currentLevel, pomScene) {
    if(!pomScene) {
        curr = levels[currentLevel]; // aktualny level
        countHill = curr[0]; // pocet kopcov v leveli
        document.getElementById("carrotsNum").textContent = numPickCarrots; // nastavi na zaciatku pocet vyzbieranych mrkiev na 0

        createImage(0, "krok", "actions"); // vytvori obrazok s krokom dopredu

        for(var i = 0; i < countHill; i++){
            scene[i] = 0;
        }

        if(curr[1].length != 0) { // ak su pevne udane mrkvy s poctom
            for (var i = 0; i < curr[1].length; i++) {
                data = curr[1][i];
                var key = Object.keys(data)[0];
                var value = data[key];
                scene[key-1] = value;

                if(value ==1){
                    oneCarrot = true;
                }

                if(value == 2){
                    twoCarrots = true;
                }
            }
        }else{
            var data = curr[2];
            if(data.split(",").length > 1){ // ak
                var split = data.split(",");
                randomNumbers = Array.from(Array( countHill-1), (_,x) => x+1);
                for(var i = 0; i < split.length; i++){
                    var coordin = split[i].split(':');
                    for(var j = 0; j< coordin[0]; j++){
                        var x = getRandomNumber();
                        scene[x] = coordin[1];
                    }
                    if(coordin[1]==2){
                        twoCarrots = true;
                    }
                    if(coordin[1]==1){
                        oneCarrot = true;
                    }
                }
            }else if(data.split("-").length > 1) {
                split = data.split(":");
                var numbers = split[0].split("-");
                randomNumbers = Array.from(Array( countHill-1), (_,x) => x+1);
                var random = Math.floor(Math.random() * (parseInt(numbers[1]) - parseInt(numbers[0]) + 1)) + parseInt(numbers[0]);
                for(var j = 0; j< random; j++)
                {
                    var x = getRandomNumber();
                    scene[x] = split[1];
                    if(split[1]==2){
                        twoCarrots = true;
                    }
                    if(split[1]==1){
                        oneCarrot = true;
                    }
                }
            }
            else {
                split = data.split(":");
                randomNumbers = Array.from(Array( countHill-1), (_,x) => x+1);
                for(var i = 0; i < split[0]; i++){
                    var x = getRandomNumber();
                    scene[x] = split[1];
                    if(split[1]==2){
                        twoCarrots = true;
                    }
                    if(split[1]==1){
                        oneCarrot = true;
                    }
                }
            }
        }


        if(oneCarrot) {
            createImage(1, "mrkva", "actions");
        }
        if(twoCarrots){
            createImage(2, "mrkva", "actions");
        }

    }else{
        scene = pomScene;
    }
    createImage(null, "car", "car");
    for (var i = 0; i < countHill; i++) {
		if(scene[i] == 0){
            createImage(null, "kopec", "hills", i);
		}else if(scene[i] == "2"){
            createImage(null, "mrkvicka", "hills", i);
            result += 2;
		}else if(scene[i]== "1"){
            createImage(null, "mrkvicky", "hills", i);
            result += 1;
		}
    }

}

function getRandomNumber(){
    var x = randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
    var index = randomNumbers.indexOf(x);
    if (index > -1) {
        randomNumbers.splice(index, 1);
    }
    return x;
}

function createImage(number, image, appendTo, id){
    var elem=document.createElement("img");
    elem.setAttribute("height", "75");
    elem.setAttribute("width", "75");
    if(image == "krok") {
        elem.setAttribute("src", "images/dopredu_o_1.png");
        elem.setAttribute("id", "dopredu");
        elem.setAttribute('onclick','vpred();')
    }else if(image == "mrkva"){
        elem.setAttribute("src", "images/mrkva_" + number + ".png");
        elem.setAttribute("id", "mrkva_" + number+"");
        if(number == 1){
            elem.setAttribute('onclick','pridajMkrvu();')
        }else{
            elem.setAttribute('onclick','pridaj2Mkrvy();')
        }
	}
    else if(image == "kopec"){
        elem.setAttribute("src", "images/kopcek_bez_mrkvy.png");
        elem.setAttribute("height", "75");
        elem.setAttribute("width", "85");
        elem.id = id;
    }
    else if(image == "mrkvicka"){
        elem.setAttribute("src", "images/mrkvicka.png");
        elem.setAttribute("height", "85");
        elem.setAttribute("width", "85");
        elem.className = "mrkvicka";
        elem.id = id;
    }
    else if(image == "mrkvicky"){
        elem.setAttribute("src", "images/mrkvicky.png");
        elem.setAttribute("height", "85");
        elem.setAttribute("width", "85");
        elem.className = "mrkvicka";
        elem.id = id;
    }
    else{
        elem.setAttribute("src", "images/kara.png");
        elem.setAttribute("height", "85");
        elem.setAttribute("width", "85");
    }

    elem.setAttribute("alt", "Mrkva");
    elem.className = 'command';
    document.getElementById(appendTo).appendChild(elem);
}

function start() {
    drawScene(currentLevel);
}

start();


//$("#commands").sortable();
$("#commands").sortable({
    items: 'li:not(.ui-state-disabled)',
});

//$("#commands").sortable();
$("#commands").disableSelection();

$("li").addClass("ui-widget-content");

function vpred() {
    var elem = document.createElement("img");
    elem.setAttribute("src", "images/dopredu_o_1.png");
    elem.setAttribute("height", "50");
    elem.setAttribute("width", "50");
    elem.setAttribute("alt", "Mrkva");
    elem.setAttribute("class", "krok");
    elem.setAttribute("id", "krok" + count);
    count++;
    var li = document.createElement('li');
    li.appendChild(elem);

    var list = document.getElementById("commands");
    if (!firstInsert) {
        firstInsert = true;
        list.insertBefore(li, list.childNodes[0]);
    } else {
        $(li).insertAfter($("#commands li:nth-last-child(2)"));
    }
}

function pridajMkrvu() {
    var elem = document.createElement("img");
    elem.setAttribute("src", "images/mrkva_1.png");
    elem.setAttribute("height", "50");
    elem.setAttribute("width", "50");
    elem.setAttribute("alt", "Mrkva");
    elem.setAttribute("class", "mrkva1");
    elem.setAttribute("id", "mrkva1" + count);
    count++;
    var li = document.createElement('li');
    li.appendChild(elem);

    var list = document.getElementById("commands");

    if (!firstInsert) {
        firstInsert = true;
        list.insertBefore(li, list.childNodes[0]);
    } else {
        $(li).insertAfter($("#commands li:nth-last-child(2)"));
    }
}

function pridaj2Mkrvy(){
        var elem=document.createElement("img");
        elem.setAttribute("src", "images/mrkva_2.png");
        elem.setAttribute("height", "50");
        elem.setAttribute("width", "50");
        elem.setAttribute("alt", "Mrkva");
        elem.setAttribute("class", "mrkva2");
        elem.setAttribute("id", "mrkva2"+count);
        count++;
        var li = document.createElement('li');
        li.appendChild(elem);

        var list = document.getElementById("commands");

        if(!firstInsert){
            firstInsert = true;
            list.insertBefore(li, list.childNodes[0]);
        }else{
            $(li ).insertAfter($("#commands li:nth-last-child(2)"));
        }
}

$(document).ready(function() {
    $("#play").click(function () {
        if(!play) {
            myMove();
            play = true;
        }
    });

    $('#commands').on('contextmenu', 'li', function(){ // pravym klikom odstrani li
        if($(this)[0].children[0].id !== "play") {
            $(this).closest('li').remove();
        }
    });
});

function myMove() {
    var pomScene = scene.slice();
    var i = 0;
    var elem = document.getElementById("car");
    var pos = 0;
    var posun = 80;
    var id = setInterval(frame, 2000);
    var pom = 0;
    pred = "#"+$("#commands").children()[0].children[0].id;
    $(pred).css({"border-color": "red",
        "border-width":"3px",
        "border-style":"solid",
        "border-radius": "49%",});
    function frame() {
        var childrens = $("#commands").children();

        if (i == childrens.length-1) {
            clearInterval(id);
            play = false;
            if(result == numPickCarrots){

                if(currentLevel != levels.length-1) {
                    $('#myModal').modal('show');
                    $("#myModal .modal-body").text('Uspesne si presiel dany level :)');
                    currentLevel++;
                    restart();
                }else{
                    $('#myModal').modal('show');
                    $("#myModal .modal-body").text('Uspesne si presiel vsetky levely :). Hra sa spusti od zaciatku.');
                    currentLevel = 0;
                    restart();
                }
            }else{
                $('#myModal').modal('show');
                $("#myModal .modal-body").text('Nepodarilo sa ti pozbierat vsetky mrkvy. Skus to znovu :)');
                elem.style.left = '0px';
                numPickCarrots = 0;
                $("#car").empty();
                $("#hills").empty();
                numPickCarrots = 0;
                result = 0;
                drawScene(currentLevel, pomScene);
                document.getElementById("carrotsNum").textContent = numPickCarrots;
                if(pred != ''){
                    $(pred).css({"border-color": "white",
                        "border-width":"3px",
                        "border-style":"solid",});
                }
            }
        } else {
            if(childrens[i].children[0].className == "krok") {
                if(pom <= countHill) {
                    pos += posun;
                    elem.style.left = pos + 'px';
                    pom++;
                    if(pred != ''){
                        $(pred).css({"border-color": "white",
                            "border-width":"3px",
                            "border-style":"solid"});
                    }
                    $("#krok"+i).css({"border-color": "red",
                        "border-width":"3px",
                        "border-style":"solid",
                        "border-radius": "49%",});
                    pred = "#krok"+i;
                }
            }else if(childrens[i].children[0].className === "mrkva1"){
                if(pred != ''){
                    $(pred).css({"border-color": "white",
                        "border-width":"3px",
                        "border-style":"solid"});
                }
                $("#mrkva1"+i).css({"border-color": "red",
                    "border-width":"3px",
                    "border-style":"solid",
                    "border-radius": "49%",});
                pred = "#mrkva1"+i;
                if(scene[pom] == 1){
                    $('#'+pom).attr('src', 'images/kopcek_bez_mrkvy.png');
                    $('#'+pom).attr('height', '75px');
                    $('#'+pom).attr('width', '75px');
                    scene[pom] = 0;
                    posun = 80;
                    numPickCarrots++;
                    document.getElementById("carrotsNum").textContent = numPickCarrots;
                }
            }
            else if(childrens[i].children[0].className === "mrkva2"){
                if(pred != ''){
                    $(pred).css({"border-color": "white",
                        "border-width":"3px",
                        "border-style":"solid"});
                }
                $("#mrkva2"+i).css({"border-color": "red",
                    "border-width":"3px",
                    "border-style":"solid",
                    "border-radius": "49%",});
                pred = "#mrkva2"+i;
                if(scene[pom] == 2){
                    $('#'+pom).attr('src', 'images/kopcek_bez_mrkvy.png');
                    $('#'+pom).attr('height', '75px');
                    $('#'+pom).attr('width', '75px');
                    scene[pom] = 0;
                    posun = 80;
                    numPickCarrots += 2;
                    document.getElementById("carrotsNum").textContent = numPickCarrots;
                }
            }

            i++;
        }
    }
}

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

function restart() {
    var elem = document.getElementById("car");
    elem.style.left = '0px';
    $("#actions").empty();

    $("#car").empty();
    $("#hills").empty();
    var commands = $('#commands').children();
    for(var i = 0; i < commands.length; i++){
        if(commands[i].children[0].id != "play"){
            commands[i].remove();
        }
    }
    firstInsert = false;
    count = 0;
    numPickCarrots = 0;
    result = 0;
    twoCarrots = false;
    oneCarrot = false;
    play = false;
    start();
}

