var timer;
var totalSeconds = 0;
var clicks = 0;
var selectedTeams;
var lockAtSaveStatistics;
var statistics;
statistics = {easy: "",medium: "", hard: "", professional: ""};
statistics["easy"] = new Array();
statistics["easy"][0] = "";
statistics["easy"][1] = "";
statistics["easy"][2] = "";
statistics["easy"][0] = {clicks: ""};
statistics["easy"][0] = {time: ""};
statistics["easy"][1] = {clicks: ""};
statistics["easy"][1] = {time: ""};
statistics["easy"][2] = {clicks: ""};
statistics["easy"][2] = {time: ""};
statistics["medium"] = new Array();
statistics["medium"][0] = "";
statistics["medium"][1] = "";
statistics["medium"][2] = "";
statistics["medium"][0] = {clicks: ""};
statistics["medium"][0] = {time: ""};
statistics["medium"][1] = {clicks: ""};
statistics["medium"][1] = {time: ""};
statistics["medium"][2] = {clicks: ""};
statistics["medium"][2] = {time: ""};
statistics["hard"] = new Array();
statistics["hard"][0] = "";
statistics["hard"][1] = "";
statistics["hard"][2] = "";
statistics["hard"][0] = {clicks: ""};
statistics["hard"][0] = {time: ""};
statistics["hard"][1] = {clicks: ""};
statistics["hard"][1] = {time: ""};
statistics["hard"][2] = {clicks: ""};
statistics["hard"][2] = {time: ""};
statistics["professional"] = new Array();
statistics["professional"][0] = "";
statistics["professional"][1] = "";
statistics["professional"][2] = "";
statistics["professional"][0] = {clicks: ""};
statistics["professional"][0] = {time: ""};
statistics["professional"][1] = {clicks: ""};
statistics["professional"][1] = {time: ""};
statistics["professional"][2] = {clicks: ""};
statistics["professional"][2] = {time: ""};

function setTime()
{
    ++totalSeconds;
    $("#seconds").html(pad(totalSeconds % 60));
    $("#minutes").html(pad(parseInt(totalSeconds / 60)));
}

function pad(val)
{
    var valString = val + "";
    if (valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
}

$(document).ready(function () {
    //Ha nincs még sessionStorage -> játék indításakor
    if (!sessionStorage.getItem("defaultName") && $("section").first().attr("id") === "mainPage")
    {
        sessionStorage.setItem("defaultName", "Anonymous");
        sessionStorage.setItem("level", "easy");
        sessionStorage.setItem("germany", true);
        sessionStorage.setItem("spain", true);
        sessionStorage.setItem("england", true);
        sessionStorage.setItem("italy", true);
        //options.xml betöltése
        var sdcard = navigator.getDeviceStorage('sdcard');
        var request = sdcard.get("footballmemory/options.xml");
        //Ha létezik a fájl -> fájlban tárolt beállítások betöltése
        request.onsuccess = function () {
            var blob = request.result;
            var reader = new FileReader();
            //Fájl tartalmának betolvasása
            reader.addEventListener("loadend", function () {
                //console.log(reader.result);
                //Parse to XML
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(reader.result, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(reader.result);
                }
                if (xmlDoc.getElementsByTagName("defaultName")[0].childNodes[0].nodeValue !== "")
                {
                    sessionStorage.setItem("defaultName", xmlDoc.getElementsByTagName("defaultName")[0].childNodes[0].nodeValue);
                }
                sessionStorage.setItem("level", xmlDoc.getElementsByTagName("level")[0].childNodes[0].nodeValue);
                for (var i = 0; i < xmlDoc.getElementsByTagName("country").length; i++)
                {
                    switch (xmlDoc.getElementsByTagName("country")[i].childNodes[0].nodeValue)
                    {
                        case "germany":
                            sessionStorage.setItem("germany",xmlDoc.getElementsByTagName("country")[i].getAttribute("enabled"));
                            break;
                        case "spain":
                            sessionStorage.setItem("spain",xmlDoc.getElementsByTagName("country")[i].getAttribute("enabled"));
                            break;
                        case "england":
                            sessionStorage.setItem("england",xmlDoc.getElementsByTagName("country")[i].getAttribute("enabled"));
                            break;
                        case "italy":
                            sessionStorage.setItem("italy",xmlDoc.getElementsByTagName("country")[i].getAttribute("enabled"));
                            break;
                    }
                }
            });
            reader.readAsText(blob);
        };
    }
    
    //index.html oldal betöltésekor
    if ($("section").first().attr("id") === "mainPage")
    {
        $("#mainPage").css("display", "block");
        if (sessionStorage.getItem("mainPageAnimation") === "true")
        {            
            $("#mainPage").attr("class", "vbox fit leftToCurrent");
        }
    }
    
    //game.html oldal betöltésekor
    if ($("section").first().attr("id") === "gamePage")
    {
        //Kártyák betöltése a beállítások alapján
        if (sessionStorage.getItem("defaultName"))
        {
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET", "config.xml", false);
            xmlhttp.send();
            xmlDoc=xmlhttp.responseXML;
            
            var selectedCountries = new Array();
            if (sessionStorage.getItem("germany")==="true")
            {
                for (var i=0; i<xmlDoc.getElementsByTagName("germany")[0].getElementsByTagName("team").length; i++)
                {
                    selectedCountries[selectedCountries.length]={name:"./logos/germany/"+xmlDoc.getElementsByTagName("germany")[0].getElementsByTagName("team")[i].childNodes[0].nodeValue, selected:false};
                }
            }
            if (sessionStorage.getItem("spain")==="true")
            {
                for (var i=0; i<xmlDoc.getElementsByTagName("spain")[0].getElementsByTagName("team").length; i++)
                {
                    selectedCountries[selectedCountries.length]={name:"./logos/spain/"+xmlDoc.getElementsByTagName("spain")[0].getElementsByTagName("team")[i].childNodes[0].nodeValue, selected:false};
                }
            }
            if (sessionStorage.getItem("italy")==="true")
            {
                for (var i=0; i<xmlDoc.getElementsByTagName("italy")[0].getElementsByTagName("team").length; i++)
                {
                    selectedCountries[selectedCountries.length]={name:"./logos/italy/"+xmlDoc.getElementsByTagName("italy")[0].getElementsByTagName("team")[i].childNodes[0].nodeValue, selected:false};
                }
            }
            if (sessionStorage.getItem("england")==="true")
            {
                for (var i=0; i<xmlDoc.getElementsByTagName("england")[0].getElementsByTagName("team").length; i++)
                {
                    selectedCountries[selectedCountries.length]={name:"./logos/england/"+xmlDoc.getElementsByTagName("england")[0].getElementsByTagName("team")[i].childNodes[0].nodeValue, selected:false};
                }
            }
            
            var selectedLevel = 0;
            switch(sessionStorage.getItem("level"))
            {
                case "easy":
                    selectedLevel = 3;
                    break;
                case "medium":
                    selectedLevel = 7;
                    break;
                case "hard":
                    selectedLevel = 12;
                    break;
                case "professional":
                    selectedLevel = 18;
                    break;
            }
            
            var selectedTeams = new Array();
            var i=0;
            while (i<selectedLevel)
            {
                var selectedNum = Math.floor(Math.random()* ((selectedCountries.length-1) - 0 + 1));
                if (!selectedCountries[selectedNum].selected)
                {
                    selectedTeams[selectedTeams.length] = {name:selectedCountries[selectedNum].name, solved:false};
                    selectedTeams[selectedTeams.length] = {name:selectedCountries[selectedNum].name, solved:false};
                    selectedCountries[selectedNum].selected = true;
                    i++;
                }
            }
            var selectedTeamsRandom = new Array();
            var i=0;
            while (i<selectedTeams.length)
            {
                var selectedNum = Math.floor(Math.random()* ((selectedTeams.length-1) - 0 + 1));
                var hasBeenNum = false;
                for (var j=0; j<selectedTeamsRandom.length; j++)
                {
                    if (selectedTeamsRandom[j] === selectedNum)
                        hasBeenNum = true;
                }
                if (!hasBeenNum)
                {
                    selectedTeamsRandom[selectedTeamsRandom.length] = selectedNum;
                    i++;
                }
            }
            for (var i=0; i<selectedTeams.length; i++)
            {
                var changeTeam = selectedTeams[i];
                selectedTeams[i] = selectedTeams[selectedTeamsRandom[i]];
                selectedTeams[selectedTeamsRandom[i]] = changeTeam;
            }
            for (var i=0; i<selectedTeams.length; i++)
            {
                var html = "<div class='card_frame'>";
                html += "<section class='container'>";
                html += "<div class='card' id='card"+i+"'>";
                html += "<figure class='front'><img src='football.jpg' height='90' width='90'></figure>";
                html += "<figure class='back'><img src='"+selectedTeams[i].name+".jpg' height='90' width='90'></figure>";
                html += "</div>";
                html += "</section>";
                html += "</div>";
                
                $(".gaia-list").append(html);                
            }
        }        
        
        //Idő számláló elindítása
        totalSeconds = 0;
        clicks = 0;
        $("#seconds").html("00");
        $("#minutes").html("00");
        timer = setInterval(setTime, 1000);
    }
    
    //options.html oldal betöltésekor
    if ($("section").first().attr("id") === "optionsPage")
    {
        if (sessionStorage.getItem("defaultName"))
        {
            $("#txtNickname").val(sessionStorage.getItem("defaultName"));
            switch (sessionStorage.getItem("level"))
            {
                case "easy":
                    $("#rbEasy").prop("checked", true);
                    break;
                case "medium":
                    $("#rbMedium").prop("checked", true);
                    break;
                case "hard":
                    $("#rbHard").prop("checked", true);
                    break;
                case "professional":
                    $("#rbProfessional").prop("checked", true);
                    break;
                default:
                    $("#rbEasy").prop("checked", true);
                    break;
            }
            if (sessionStorage.getItem("germany") === "true")
            {
                $("#chboxGermany").prop("checked", true);
            }
            else
            {
                $("#chboxGermany").prop("checked", false);
            }
            if (sessionStorage.getItem("spain") === "true")
            {
                $("#chboxSpain").prop("checked", true);
            }
            else
            {
                $("#chboxSpain").prop("checked", false);
            }
            if (sessionStorage.getItem("england") === "true")
            {
                $("#chboxEngland").prop("checked", true);
            }
            else
            {
                $("#chboxEngland").prop("checked", false);
            }
            if (sessionStorage.getItem("italy") === "true")
            {
                $("#chboxItaly").prop("checked", true);
            }
            else
            {
                $("#chboxItaly").prop("checked", false);
            }
        }
    }
    
    //statistics.html oldal betöltésekor
    if ($("section").first().attr("id") === "statisticsPage")
    {
        //statistics.xml betöltése
        var sdcard = navigator.getDeviceStorage('sdcard');
        var request = sdcard.get("footballmemory/statistics.xml");
        request.onsuccess = function () {
            var blob = request.result;
            var reader = new FileReader();
            //Fájl tartalmának betolvasása
            reader.addEventListener("loadend", function () {
                //console.log(reader.result);
                //Parse to XML
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(reader.result, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(reader.result);
                }
                var txt;
                //Easy
                if (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "3. "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3ateasy" );
                }
                if (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "2. "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3ateasy" );
                }
                if (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "1. "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3ateasy" );
                }
                //Medium
                if (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "3. "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atmedium" );
                }
                if (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "2. "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atmedium" );
                }
                if (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "1. "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atmedium" );
                }
                //Hard
                if (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "3. "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3athard" );
                }
                if (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "2. "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3athard" );
                }
                if (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "1. "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3athard" );
                }
                //Professional
                if (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "3. "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atprofessional" );
                }
                if (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "2. "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atprofessional" );
                }
                if (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue !== "empty")
                {
                    txt = "<ul style='margin-left:17px;'>";
                    txt = txt + "<li>";
                    txt = txt + "1. "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue+"<br>";
                    txt = txt + "Clicks: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue+", Time: "+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue+":"+xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                    txt = txt + "</li>";
                    txt = txt + "</ul>";
                    $( txt ).insertAfter( "#top3atprofessional" );
                }
            });
            reader.readAsText(blob);
        };
        /*request.onerror  = function () {              
        };*/
    }

    $("#start").click(function () {        
        $("#mainPage").attr("class", "currentToLeft");
        window.location.href="game.html";       
    });
    
    $("#btnOptions").click(function () {
        $("#mainPage").attr("class", "currentToLeft");
        window.location.href = "options.html";
    });
    
    $("#btnStatistics").click(function () {
        $("#mainPage").attr("class","currentToLeft");
        window.location.href = "statistics.html";
    });
    
    $("#exit").click(function () {
        window.close();
    });  
    
    //Legalább egy ország ki kell legyen jelölve
    $("input[name=chboxCountries]").change(function () {
        var atLeastOneTrue = false;
        $("input[name=chboxCountries]").each(function () {
            if ($(this).prop("checked") === true)
                atLeastOneTrue = true;
        });
        if (!atLeastOneTrue)
        {
            $(this).prop("checked", true);
            alert("At least one country must be checked.");
        }
    });
    
    $("#btnBackToMainFromGame").click(function () {
        clearTimeout(timer);
        $("#gamePage").attr("class", "currentToRight");
        sessionStorage.setItem("mainPageAnimation", "true");
        window.location.href = "index.html";
    });
    
    $("#btnBackToMainFromOptions").click(function () {       
        //options.xml fájl törlése - mind1 hogy létezett-e vagy sem
        var sdcard = navigator.getDeviceStorage('sdcard');
        sdcard.delete("footballmemory/options.xml");
        //var request = sdcard.delete("footballmemory/options.xml");
        //Új options.xml fájl összerakása beállítások alapján
        var txt = "<?xml version='1.0' encoding='UTF-8'?>";
        txt = txt + "<options>";
        txt = txt + "<defaultName>";
        if ($("#txtNickname").val() !== "")
        {
            txt = txt + $("#txtNickname").val();
            sessionStorage.setItem("defaultName",$("#txtNickname").val());
        }
        else
        {
            txt = txt + "Anonymous";
            sessionStorage.setItem("defaultName","Anonymous");
        }
        txt = txt + "</defaultName>";
        txt = txt + "<level>";
        txt = txt + $('input[name=radioLevel]:checked').val();
        sessionStorage.setItem("level",$('input[name=radioLevel]:checked').val());
        txt = txt + "</level>";
        txt = txt + "<countries>";
        if ($("#chboxGermany").prop("checked") === true)
        {
            txt = txt + "<country enabled='true'>";
            sessionStorage.setItem("germany","true");
        }
        else
        {
            txt = txt + "<country enabled='false'>";
            sessionStorage.setItem("germany","fasle");
        }
        txt = txt + "germany";
        txt = txt + "</country>";
        if ($("#chboxSpain").prop("checked") === true)
        {
            txt = txt + "<country enabled='true'>";
            sessionStorage.setItem("spain","true");
        }
        else
        {
            txt = txt + "<country enabled='false'>";
            sessionStorage.setItem("spain","false");
        }
        txt = txt + "spain";
        txt = txt + "</country>";
        if ($("#chboxEngland").prop("checked") === true)
        {
            txt = txt + "<country enabled='true'>";
            sessionStorage.setItem("england","true");
        }
        else
        {
            txt = txt + "<country enabled='false'>";
            sessionStorage.setItem("england","false");
        }
        txt = txt + "england";
        txt = txt + "</country>";
        if ($("#chboxItaly").prop("checked") === true)
        {
            txt = txt + "<country enabled='true'>";
            sessionStorage.setItem("italy","true");
        }
        else
        {
            txt = txt + "<country enabled='false'>";
            sessionStorage.setItem("italy","false");
        }
        txt = txt + "italy";
        txt = txt + "</country>";
        txt = txt + "</countries>";
        txt = txt + "</options>";
        //Parse to XML
        if (window.DOMParser)
        {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(txt);
        }

        var serializer = new XMLSerializer();
        var str = serializer.serializeToString(xmlDoc);
        var file = new Blob([str], {type: "text/xml"});
        request = sdcard.addNamed(file, "footballmemory/options.xml");
        /*request.onsuccess = function () {
        var result = this.result;
        console.log(result);
        };*/
        
        $("#optionsPage").attr("class", "currentToRight");
        sessionStorage.setItem("mainPageAnimation","true");
        window.location.href="index.html";
    });
    
    $("#btnBackToMainFromStatistics").click(function () {
        $("#statisticsPage").attr("class", "currentToRight");
        sessionStorage.setItem("mainPageAnimation","true");
        window.location.href="index.html";
    });

    //Ha benne van a játékos a top3-ban akkor felugró ablak
    $( "#formConfirm" ).submit(function( event ) {
        event.preventDefault();
    });
    
    $("#btnOkAtConfirm").click(function() {
        if ($("#txtNicknameAtConfirm").val() !== "")
        {
            //Mentés
            //statistics.xml betöltése
            var sdcard = navigator.getDeviceStorage('sdcard');
            var request = sdcard.get("footballmemory/statistics.xml");
            request.onsuccess = function () { 
                var blob = request.result;
                var reader = new FileReader();
                //Fájl tartalmának betolvasása
                reader.addEventListener("loadend", function () {
                    //console.log(reader.result);
                    //Parse to XML
                    if (window.DOMParser)
                    {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(reader.result, "text/xml");
                    }
                    else // Internet Explorer
                    {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(reader.result);
                    }
                    var monitoring;
                    //Megnézzük benne van-e az eredmény a top3-ban
                    switch (sessionStorage.getItem("level"))
                    {
                        case "easy":
                            if (statistics["easy"][0]["clicks"] !== "empty")
                            {                                
                                if (parseInt(statistics["easy"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                {
                                    if (parseInt(statistics["easy"][0]["clicks"]) > parseInt($("#clicks").text()))
                                    {                                        
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                        xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                    }
                                    else
                                    {
                                        if (parseInt(statistics["easy"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                        {
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            monitoring = "second";
                                        }
                                    }
                                }
                                else
                                {
                                    monitoring = "second";
                                }
                            }
                            else
                            {
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                            }
                            if (monitoring === "second")
                            {
                                if (statistics["easy"][1]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["easy"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["easy"][1]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["easy"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                            else
                                            {
                                                monitoring = "third";
                                            }
                                        }
                                    }
                                    else
                                    {
                                        monitoring = "third";
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            if (monitoring === "third")
                            {
                                if (statistics["easy"][2]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["easy"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["easy"][2]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["easy"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            break;
                        case "medium":
                            if (statistics["medium"][0]["clicks"] !== "empty")
                            {

                                if (parseInt(statistics["medium"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                {
                                    if (parseInt(statistics["medium"][0]["clicks"]) > parseInt($("#clicks").text()))
                                    {                                        
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                        xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                    }
                                    else
                                    {
                                        if (parseInt(statistics["medium"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                        {
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            monitoring = "second";
                                        }
                                    }
                                }
                                else
                                {
                                    monitoring = "second";
                                }
                            }
                            else
                            {
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                            }
                            if (monitoring === "second")
                            {
                                if (statistics["medium"][1]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["medium"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["medium"][1]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["medium"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                            else
                                            {
                                                monitoring = "third";
                                            }
                                        }
                                    }
                                    else
                                    {
                                        monitoring = "third";
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            if (monitoring === "third")
                            {
                                if (statistics["medium"][2]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["medium"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["medium"][2]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["medium"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            break;
                        case "hard":
                            if (statistics["hard"][0]["clicks"] !== "empty")
                            {

                                if (parseInt(statistics["hard"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                {
                                    if (parseInt(statistics["hard"][0]["clicks"]) > parseInt($("#clicks").text()))
                                    {                                        
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                        xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                    }
                                    else
                                    {
                                        if (parseInt(statistics["hard"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                        {
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            monitoring = "second";
                                        }
                                    }
                                }
                                else
                                {
                                    monitoring = "second";
                                }
                            }
                            else
                            {
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                            }
                            if (monitoring === "second")
                            {
                                if (statistics["hard"][1]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["hard"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["hard"][1]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["hard"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                            else
                                            {
                                                monitoring = "third";
                                            }
                                        }
                                    }
                                    else
                                    {
                                        monitoring = "third";
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            if (monitoring === "third")
                            {
                                if (statistics["hard"][2]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["hard"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["hard"][2]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["hard"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            break;
                        case "professional":
                            if (statistics["professional"][0]["clicks"] !== "empty")
                            {

                                if (parseInt(statistics["professional"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                {
                                    if (parseInt(statistics["professional"][0]["clicks"]) > parseInt($("#clicks").text()))
                                    {                                        
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                        xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                    }
                                    else
                                    {
                                        if (parseInt(statistics["professional"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                        {
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            monitoring = "second";
                                        }
                                    }
                                }
                                else
                                {
                                    monitoring = "second";
                                }
                            }
                            else
                            {
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;

                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                            }
                            if (monitoring === "second")
                            {
                                if (statistics["professional"][1]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["professional"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["professsional"][1]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["professional"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                            else
                                            {
                                                monitoring = "third";
                                            }
                                        }
                                    }
                                    else
                                    {
                                        monitoring = "third";
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue;
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            if (monitoring === "third")
                            {
                                if (statistics["professional"][2]["clicks"] !== "empty")
                                {
                                    if (parseInt(statistics["professional"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                    {
                                        if (parseInt(statistics["professional"][2]["clicks"]) > parseInt($("#clicks").text()))
                                        {
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                            xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                        }
                                        else
                                        {
                                            if (parseInt(statistics["professional"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                            {
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                                xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("nickname")[0].childNodes[0].nodeValue = $("#txtNicknameAtConfirm").val();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue = $("#clicks").text();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue = $("#minutes").text();
                                    xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue = $("#seconds").text();
                                }
                            }
                            break;
                    }
                    var serializer = new XMLSerializer();
                    var str = serializer.serializeToString(xmlDoc);
                    var file = new Blob([str], {type: "text/xml"});
                    var sdcardDelete=sdcard.delete("footballmemory/statistics.xml");
                    sdcardDelete.onsuccess = function () {
                        //console.log('File successfully removed.');
                        sdcard.addNamed(file, "footballmemory/statistics.xml");
                        $("#formConfirm").css("display", "none");
                    };                                                            
                    /*var request = sdcard.delete("footballmemory/statistics.xml");
                    request = sdcard.addNamed(file, "footballmemory/statistics.xml");*/
                });
                reader.addEventListener("error", function () {
                    $("#formConfirm").css("display", "none");
                });
                reader.readAsText(blob);
            };
            request.onerror  = function () { 
                $("#formConfirm").css("display", "none");
            };
        }
        else
        {
            alert("You have to type at least one character");
        }               
    });
    
    $("#btnResetAtConfirm").click(function() {
        $("#txtNicknameAtConfirm").val("");
    });
    
    var flippedCard = "";
    var lock = false;
    $(".card").click(function () {
        if (!lock)
        {    
            if (!selectedTeams[$(this).attr("id").substring(4,$(this).attr("id").length)].solved)
            {
                if (flippedCard === $(this).attr("id"))
                {
                    flippedCard = "";            
                }
                else
                {
                    if (flippedCard === "")
                    {
                        flippedCard = $(this).attr("id");
                    }
                    else
                    {                      
                        if (selectedTeams[$(this).attr("id").substring(4,$(this).attr("id").length)].name === selectedTeams[flippedCard.substring(4,flippedCard.length)].name)
                        {
                            selectedTeams[$(this).attr("id").substring(4,$(this).attr("id").length)].solved = true;
                            selectedTeams[flippedCard.substring(4,flippedCard.length)].solved = true;
                            flippedCard = "";
                            
                            var allSolved = true;
                            for (var i=0; i<selectedTeams.length; i++)
                            {
                                if (!selectedTeams[i].solved)
                                    allSolved=false;
                            }
                            if (allSolved)
                            {
                                var allSolvedTimer = setInterval(function () {
                                    clearInterval(allSolvedTimer);
                                    clearInterval(timer);
                                    //statistics.xml betöltése
                                    var sdcard = navigator.getDeviceStorage('sdcard');
                                    var request = sdcard.get("footballmemory/statistics.xml");                                   
                                    request.onsuccess = function () {
                                        var blob = request.result;
                                        var reader = new FileReader();
                                        //Fájl tartalmának betolvasása
                                        reader.addEventListener("loadend", function () {
                                            //console.log(reader.result);
                                            //Parse to XML
                                            if (window.DOMParser)
                                            {
                                                parser = new DOMParser();
                                                xmlDoc = parser.parseFromString(reader.result, "text/xml");
                                            }
                                            else // Internet Explorer
                                            {
                                                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                                xmlDoc.async = false;
                                                xmlDoc.loadXML(reader.result);
                                            }                                                                                       
                                            statistics["easy"][0]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["easy"][0]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["easy"][1]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["easy"][1]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["easy"][2]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["easy"][2]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["medium"][0]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["medium"][0]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["medium"][1]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["medium"][1]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["medium"][2]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["medium"][2]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["hard"][0]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["hard"][0]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["hard"][1]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["hard"][1]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["hard"][2]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["hard"][2]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["professional"][0]["clicks"] = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["professional"][0]["time"] = (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["professional"][1]["clicks"] = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["professional"][1]["time"] = (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            statistics["professional"][2]["clicks"] = xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                            statistics["professional"][2]["time"] = (xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                            var monitoring;
                                            //Megnézzük benne van-e az eredmény a top3-ban
                                            switch(sessionStorage.getItem("level"))
                                            {
                                                case "easy":
                                                    if (statistics["easy"][0]["clicks"] !== "empty")
                                                    {
                                                        if (parseInt(statistics["easy"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                                        {
                                                            if (parseInt(statistics["easy"][0]["clicks"]) > parseInt($("#clicks").text()))
                                                            {                                                               
                                                                //Confirm
                                                                $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                $("#formConfirm").css("display", "block");
                                                            }
                                                            else
                                                            {
                                                                if (parseInt(statistics["easy"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {                                                                   
                                                                    monitoring = "second";
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            monitoring = "second";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        //Confirm
                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                        $("#formConfirm").css("display", "block");
                                                    }
                                                    if (monitoring === "second")
                                                    {
                                                        if (statistics["easy"][1]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["easy"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["easy"][1]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["easy"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                    else
                                                                    {
                                                                        monitoring = "third";
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                monitoring = "third";
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    if (monitoring === "third")
                                                    {
                                                        if (statistics["easy"][2]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["easy"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["easy"][2]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["easy"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }                        
                                                    break;
                                                case "medium":
                                                    if (statistics["medium"][0]["clicks"] !== "empty")
                                                    {
                                                        if (parseInt(statistics["medium"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                                        {
                                                            if (parseInt(statistics["medium"][0]["clicks"]) > parseInt($("#clicks").text()))
                                                            {                                                               
                                                                //Confirm
                                                                $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                $("#formConfirm").css("display", "block");
                                                            }
                                                            else
                                                            {
                                                                if (parseInt(statistics["medium"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {                                                                   
                                                                    monitoring = "second";
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            monitoring = "second";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        //Confirm
                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                        $("#formConfirm").css("display", "block");
                                                    }
                                                    if (monitoring === "second")
                                                    {
                                                        if (statistics["medium"][1]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["medium"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["medium"][1]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["medium"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                    else
                                                                    {
                                                                        monitoring = "third";
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                monitoring = "third";
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    if (monitoring === "third")
                                                    {
                                                        if (statistics["medium"][2]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["medium"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["medium"][2]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["medium"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    break;
                                                case "hard":
                                                    if (statistics["hard"][0]["clicks"] !== "empty")
                                                    {
                                                        if (parseInt(statistics["hard"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                                        {
                                                            if (parseInt(statistics["hard"][0]["clicks"]) > parseInt($("#clicks").text()))
                                                            {                                                               
                                                                //Confirm
                                                                $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                $("#formConfirm").css("display", "block");
                                                            }
                                                            else
                                                            {
                                                                if (parseInt(statistics["hard"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {                                                                   
                                                                    monitoring = "second";
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            monitoring = "second";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        //Confirm
                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                        $("#formConfirm").css("display", "block");
                                                    }
                                                    if (monitoring === "second")
                                                    {
                                                        if (statistics["hard"][1]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["hard"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["hard"][1]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["hard"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                    else
                                                                    {
                                                                        monitoring = "third";
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                monitoring = "third";
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    if (monitoring === "third")
                                                    {
                                                        if (statistics["hard"][2]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["hard"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["hard"][2]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["hard"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    break;
                                                case "professional":
                                                    if (statistics["professional"][0]["clicks"] !== "empty")
                                                    {
                                                        if (parseInt(statistics["professional"][0]["clicks"]) >= parseInt($("#clicks").text()))
                                                        {
                                                            if (parseInt(statistics["professional"][0]["clicks"]) > parseInt($("#clicks").text()))
                                                            {                                                               
                                                                //Confirm
                                                                $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                $("#formConfirm").css("display", "block");
                                                            }
                                                            else
                                                            {
                                                                if (parseInt(statistics["professional"][0]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {                                                                   
                                                                    monitoring = "second";
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            monitoring = "second";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        //Confirm
                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                        $("#formConfirm").css("display", "block");
                                                    }
                                                    if (monitoring === "second")
                                                    {
                                                        if (statistics["professional"][1]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["professional"][1]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["professional"][1]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["professional"][1]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                    else
                                                                    {
                                                                        monitoring = "third";
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                monitoring = "third";
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    if (monitoring === "third")
                                                    {
                                                        if (statistics["professional"][2]["clicks"] !== "empty")
                                                        {
                                                            if (parseInt(statistics["professional"][2]["clicks"]) >= parseInt($("#clicks").text()))
                                                            {
                                                                if (parseInt(statistics["professional"][2]["clicks"]) > parseInt($("#clicks").text()))
                                                                {
                                                                    //Confirm
                                                                    $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                    $("#formConfirm").css("display", "block");
                                                                }
                                                                else
                                                                {
                                                                    if (parseInt(statistics["professional"][2]["time"]) > ((parseInt($("#minutes").text()) * 60) + parseInt($("#seconds").text())))
                                                                    {
                                                                        //Confirm
                                                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                                        $("#formConfirm").css("display", "block");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            //Confirm
                                                            $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                                            $("#formConfirm").css("display", "block");
                                                        }
                                                    }
                                                    break;
                                            }
                                        });
                                        reader.readAsText(blob);
                                    };
                                    request.onerror = function () {                                       
                                        //Új üres statistics.xml fájl összerakása
                                        var txt = "<?xml version='1.0' encoding='UTF-8'?>";
                                        txt = txt + "<statistics>";
                                        txt = txt + "<easy>";
                                        txt = txt + "<first>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</first>";
                                        txt = txt + "<second>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</second>";
                                        txt = txt + "<third>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</third>";
                                        txt = txt + "</easy>";
                                        txt = txt + "<medium>";
                                        txt = txt + "<first>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</first>";
                                        txt = txt + "<second>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</second>";
                                        txt = txt + "<third>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</third>";
                                        txt = txt + "</medium>";
                                        txt = txt + "<hard>";
                                        txt = txt + "<first>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</first>";
                                        txt = txt + "<second>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</second>";
                                        txt = txt + "<third>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</third>";
                                        txt = txt + "</hard>";
                                        txt = txt + "<professional>";
                                        txt = txt + "<first>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</first>";
                                        txt = txt + "<second>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</second>";
                                        txt = txt + "<third>";
                                        txt = txt + "<nickname>empty</nickname>";
                                        txt = txt + "<clicks>empty</clicks>";
                                        txt = txt + "<time>";
                                        txt = txt + "<minutes>empty</minutes>";
                                        txt = txt + "<seconds>empty</seconds>";
                                        txt = txt + "</time>";
                                        txt = txt + "</third>";
                                        txt = txt + "</professional>";
                                        txt = txt + "</statistics>";
                                        //Parse to XML
                                        if (window.DOMParser)
                                        {
                                            parser = new DOMParser();
                                            xmlDoc = parser.parseFromString(txt, "text/xml");
                                        }
                                        else // Internet Explorer
                                        {
                                            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                            xmlDoc.async = false;
                                            xmlDoc.loadXML(txt);
                                        }
                                        statistics["easy"][0]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["easy"][0]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["easy"][1]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["easy"][1]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["easy"][2]["clicks"] = xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["easy"][2]["time"] = (xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("easy")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["medium"][0]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["medium"][0]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["medium"][1]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["medium"][1]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["medium"][2]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["medium"][2]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["hard"][0]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["hard"][0]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["hard"][1]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["hard"][1]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["hard"][2]["clicks"] = xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["hard"][2]["time"] = (xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("hard")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["professional"][0]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["professional"][0]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("first")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("first")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["professional"][1]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["professional"][1]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("second")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("second")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        statistics["professional"][2]["clicks"] = xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("clicks")[0].childNodes[0].nodeValue;
                                        statistics["professional"][2]["time"] = (xmlDoc.getElementsByTagName("medium")[0].getElementsByTagName("third")[0].getElementsByTagName("minutes")[0].childNodes[0].nodeValue * 60) + xmlDoc.getElementsByTagName("professional")[0].getElementsByTagName("third")[0].getElementsByTagName("seconds")[0].childNodes[0].nodeValue;
                                        var serializer = new XMLSerializer();
                                        var str = serializer.serializeToString(xmlDoc);
                                        var file = new Blob([str], {type: "text/xml"});
                                        request = sdcard.addNamed(file, "footballmemory/statistics.xml");
                                        $("#txtNicknameAtConfirm").val(sessionStorage.getItem("defaultName"));
                                        $("#formConfirm").css("display","block");                                        
                                    };
                                }, 1000);
                            }
                        }
                        else
                        {
                            //Nem talált
                            //Késleltetés - visszaforgatás
                            lock = true;
                            var thisFlipped = $(this).attr("id");
                            var backFlippedTimer = setInterval(function () {
                                document.getElementById(thisFlipped).toggleClassName('flipped');
                                document.getElementById(flippedCard).toggleClassName('flipped');
                                flippedCard = "";
                                lock = false;
                                clearInterval(backFlippedTimer);
                            }, 2000);                                                   
                        }                        
                    }
                }

                var card = this;
                card.toggleClassName('flipped');
                //számolni a klikkeléseket
                clicks++;
                clicks+="";
                if (clicks.length<2)
                {
                    $("#clicks").html(("0"+clicks).toString());
                }
                else
                   $("#clicks").html(clicks);
            }
        }
    });
});


