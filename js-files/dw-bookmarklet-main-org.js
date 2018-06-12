window.wissBmControl = new (function () {

    var initialized = false;


    var showError = function (message, textStatus, errorThrown) {
        /* create popup mit schÃ¶ner fehlerausgabe
         output message
         Bitte schicken Sie ggf. den folgenden Fehler an die Entwickler:
         output errorThrown
         */
        console.log(message + " - " + textStatus + " : " + errorThrown);
    };

    var createInvoke = function () {
            return function () {
                // Ab hier haben wir $ und d3 zur VerfÃ¼gung

                // Die verschiedenen JS Dateien und CSS Dateien laden
                var isLocal = document.getElementById("wissBmLoader").getAttribute("isLocal");

                // Falls gerade an der App entwickelt wird, werden die Files lokal aufgerufen
                if (isLocal === "local") {
                    console.log("Local Server");
                    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    $('head').append('<script src="http://localhost:8080/RankBubbles.js"></script>');
                    $('head').append('<script src="http://localhost:8080/DevicesPieChart.js"></script>');
                    $('head').append('<script src="http://localhost:8080/PageImpressionsTable.js"></script>');
                    $('head').append('<script src="http://localhost:8080/CountryChart.js"></script>');
                    $('head').append('<script src="http://localhost:8080/AccessChart.js"></script>');
                    $('head').append('<link rel="stylesheet" type="text/css" href="http://localhost:8080/style.css">');

                }
                //Im normalen Zustand werden die Files von wisslab.org geladen
                else if (isLocal !== "local") {
                    console.log("Wisslab.org");
                    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    $('head').append('<script src="http://dw1.wisslab.org/DWBeta/RankBubbles.js"></script>');
                    $('head').append('<script src="http://dw1.wisslab.org/DWBeta/DevicesPieChart.js"></script>');
                    $('head').append('<script src="http://dw1.wisslab.org/DWBeta/PageImpressionsTable.js"></script>');
                    $('head').append('<script src="http://dw1.wisslab.org/DWBeta/CountryChart.js"></script>');
                    $('head').append('<script src="http://dw1.wisslab.org/DWBeta/AccessChart.js"></script>');
                    $('head').append('<link rel="stylesheet" type="text/css" href="http://dw1.wisslab.org/DWBeta/style.css">');
                }


                var currentLocation = window.location;
                console.log("Current URL: " + currentLocation);
                var urlstring = currentLocation.toString();
                console.log("URL: " + urlstring);

                //ÃœberprÃ¼fen, ob es sich um einen Artikel oder um eine Start/Rubrikenseite handelt.
                var isArticle = checkIfArticle();
                console.log("isArticle:" + isArticle);

                var articleID = getArticleID(urlstring);
                console.log("Article ID: " + articleID);
                console.log(articleID);

                function checkIfArticle() {
                    if (window.location.href.indexOf("/s-") > -1) {
                        return false;
                    } else {
                        return true;
                    }
                }

                function getArticleID(url) {
                    //var regexp = new RegExp('#([^\\s]*)', 'g');
                    //urlstring = urlstring.replace(regexp, '');
                    var ArticleId = "";
                    var newUrl = url;

                    //Falls chinesischer Artikel
                    if (newUrl.includes("?&zhongwen=trad")) {
                        newUrl = newUrl.replace("?&zhongwen=trad", "");
                    } else if (url.includes("?&zhongwen=simp")) {
                        newUrl = newUrl.replace("?&zhongwen=simp", "");
                        console.log(newUrl.toString());
                    }

                    if (isArticle) {
                        ArticleId = newUrl.substr(newUrl.length - 8);
                        console.log(ArticleId);

                    } else if (!isArticle) {
                        ArticleId = newUrl.substr(newUrl.length - 6);
                        ArticleId = ArticleId.replace(/\D/g, '');
                        console.log(ArticleId);
                    }

                    return ArticleId;



                }


                // Hier alle echten Datenurls definieren (vorher id auslesen)

                //Tagesverlauf in Stunden
                var api_visits_stunden_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_time_hour_event,m_visits}&sort={d_time_hour_event}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_visits_stunden_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_time_hour_event,m_visits}&sort={d_time_hour_event}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";

                var api_visits_stunden_app_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_time_hour_event,m_visits}&sort={d_time_hour_event}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_visits_stunden_app_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_time_hour_event,m_visits}&sort={d_time_hour_event}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //Besuche
                var api_visits_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23721,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_visits_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23721,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //-->Visits durch App.<--
                var api_visits_app_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_354202,m_visits}&sort={-m_visits}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_visits_app_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_354202,m_visits}&sort={-m_visits}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //Nutzung nach Devices (Kuchen)
                var api_quelle_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_344313,m_visits}&sort={-m_visits}&filter={$OR:{cl_344313:{$lk:'phone'},cl_344313:{$lk:'desktop'}},cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_quelle_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_344313,m_visits}&sort={-m_visits}&filter={$OR:{cl_344313:{$lk:'phone'},cl_344313:{$lk:'desktop'}},cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //Wie der Artikel gefunden wird.
                var api_zugriff_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23648,d_source,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_zugriff_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23648,d_source,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";

                var api_zugriff_app_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_26610,m_visits,d_source}&sort={-m_visits}&filter={cl_26610:{$lk:'" + articleID + "'}}&space={s:510546}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_zugriff_app_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_26610,m_visits,d_source}&sort={-m_visits}&filter={cl_26610:{$lk:'" + articleID + "'}}&space={s:510546}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //Wo der Artikel gefunden wird
                var api_land_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_geo_country,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_land_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_geo_country,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";

                var api_land_app_gestern = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_geo_country,m_visits,cl_26610}&sort={-m_visits}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'-1'}}&max-results=50&page-num=1";
                var api_land_app_heute = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={d_geo_country,m_visits,cl_26610}&sort={-m_visits}&filter={cl_26610:{$eq:'" + articleID + "'}}&space={s:510546}&period={R:{D:'0'}}&max-results=50&page-num=1";

                //////Test//////
                var api_gesamtaufrufe_heute_ohne_app = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23648,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&segment=100070026&space={s:510544}&period={R:{D:'0'}}&max-results=50&page-num=1";
                var api_gesamtaufrufe_gestern_ohne_app = "https://apirest.atinternet-solutions.com/data/v2/json/getData?&columns={cl_23648,m_visits}&sort={-m_visits}&filter={cl_23648:{$eq:'" + articleID + "'}}&segment=100070026&space={s:510544}&period={R:{D:'-1'}}&max-results=50&page-num=1";


                var username;
                var password;
                var zDaten = "";

                var time = new Date().getHours();
                //console.log(time);
                //var rememberMe;

                var ladeStatus = 0;

                function setLadeStatus() {
                    var apiNr = 0;
                    if (isArticle) {
                        apiNr = 20;
                    } else {
                        apiNr = 2;
                    }
                    ladeStatus = ladeStatus + (100 / apiNr);
                    setLoaderWidth(apiNr);
                }

                function getLadeStatus() {
                    var ls = ladeStatus;
                    return Math.round(ls);
                }

                var barWidth = 0;

                function setLoaderWidth(apiNr) {
                    barWidth = Math.round(ladeStatus * 3.8);
                    var rect = d3.select("#loadingBar")
                        .attr("width", barWidth);
                    /*rect.transition()
                        .duration(500)
                        .delay(0)
                        .attr("width", barWidth);*/

                }


                function loader() {
                    barWidth = Math.round(ladeStatus * 3.8);
                    var w = 380,
                        h = 5;

                    var canvas = d3.select("#loaderContainer").append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .style("border-radius", "2px")
                        .style("background-color", "#DCDCDC");

                    var rect = canvas.append("rect")
                        .attr("id", "loadingBar")
                        .attr("width", barWidth)
                        .attr("height", 5)
                        .attr("fill", "#002D5A")
                        .style("opacity", "0.8")
                        .style("border-radius", "2px");

                    // rect.transition()
                    //     .duration(200)
                    //     .attr("width", 300);
                }


                function buildLoadingText() {
                    var ltd = document.getElementById("loadingTextDiv");
                    ltd.parentNode.removeChild(ltd);

                    var loadingTextDiv = document.createElement("div");
                    loadingTextDiv.setAttribute("id", "loadingTextDiv");
                    loadingTextDiv.style.width = "100%";
                    loadingTextDiv.style.textAlign = "center";
                    var loaderContainer = document.getElementById("loaderContainer");
                    loaderContainer.appendChild(loadingTextDiv);
                    var loadingText = document.createTextNode(getLadeStatus() + "%");
                    loadingTextDiv.appendChild(loadingText);
                }


                //Elemente fÃ¼r Frame festlegen
                var head = document.getElementsByTagName("head")[0];
                var margin = {top: 40, right: 0, bottom: -40, left: 0};
                var popup = document.createElement('div');
                var topdiv = document.createElement('div');
                var close = document.createElement('a');
                var text = document.createElement("p");
                text.innerHTML = "&#9587";
                var button = document.createElement("div");
                popup.setAttribute("id", "popup");
                topdiv.setAttribute("id", "topdiv");

                startPopup();

                function keineDaten() {
                    var keineDaten = document.createElement("div");
                    keineDaten.setAttribute("id", "keineDaten");
                    keineDaten.style.width = "360px";
                    keineDaten.style.backgroundColor = "#C5292D";
                    keineDaten.style.color = "white";
                    keineDaten.style.textAlign = "center";
                    keineDaten.style.padding = "10px";
                    keineDaten.style.marginBottom = "10px";
                    keineDaten.innerHTML = "Leider kamen von At-Internet keine Daten!";
                    removeLogin();
                    buildLogin();
                    var login = document.getElementById("login");
                    login.insertBefore(keineDaten, login.childNodes[1]);
                }


                function checkCookie(cname) {
                    var name = getCookie(cname);
                    if (name == "") {
                        return zDaten;
                    } else {
                        zDaten = getCookie("Zugangsdaten");

                    }
                }

                function setCookie(uname, pword) {
                    document.cookie = "Zugangsdaten=" + uname + ":" + pword + "; path=/";


                }


                function getCookie(cname) {
                    var name = cname + "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                }

                function deleteCookies() {
                    document.cookie = "Zugangsdaten=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }

                function startPopup() {
                    if (document.getElementById("popup") != undefined) {

                        //} else if (checkIfArticle() == false){

                    } else if (getCookie("Zugangsdaten") == "") {
                        buildFrame();
                        buildLogin();

                    } else {
                        //rank();
                        zDaten = getCookie("Zugangsdaten");
                        buildFrame();
                        buildLogin();
                        fillLoginData();
                        loading();
                        testApiBuildDashboard();
                    }
                }


                function getUsername() {
                    var logindata = getCookie("Zugangsdaten");
                    var uname = logindata.substring(0, logindata.indexOf(":"))
                    return uname;
                }

                function getPassword() {
                    var logindata = getCookie("Zugangsdaten");
                    var pword = logindata.substring(logindata.indexOf(":") + 1, logindata.length)
                    return pword;
                }

                function fillLoginData() {
                    var usernameField = document.getElementById("username");
                    usernameField.value = getUsername();
                    var passwordField = document.getElementById("password");
                    passwordField.value = getPassword();

                }


                function buildLogin() {
                    var loginDiv = document.createElement("div");
                    loginDiv.setAttribute("id", "login");
                    loginDiv.style.marginLeft = "10px";
                    loginDiv.style.marginRight = "10px";
                    loginDiv.style.marginTop = "10px";
                    loginDiv.style.fontFamily = "Arial";
                    loginDiv.style.fontSize = "12px";
                    popup.appendChild(loginDiv);

                    var logoDiv = document.createElement("div");
                    logoDiv.style.width = "100%";
                    loginDiv.appendChild(logoDiv);

                    var logo = document.createElement("img");
                    logo.setAttribute("id", "logo");
                    logo.setAttribute("src", "http://dw1.wisslab.org/DW/dwlogobild.jpg");
                    logo.style.align = "middle";
                    logo.style.width = "100%"
                    logoDiv.appendChild(logo);

                    //Login Felder erzeugen
                    var text = document.createTextNode("Username");
                    loginDiv.appendChild(text);
                    var input = document.createElement("input");
                    input.setAttribute("type", "text");
                    input.setAttribute("placeholder", "Enter Username");
                    input.setAttribute("id", "username");
                    //input.required = true;
                    input.style.width = "100%";
                    input.style.padding = "12px 12px";
                    input.style.margin = "8px 0";
                    input.style.display = "inline-block";
                    input.style.boxSizing = "border-box";
                    loginDiv.appendChild(input);


                    var text2 = document.createTextNode("Password");
                    loginDiv.appendChild(text2);
                    var input2 = document.createElement("input");
                    input2.setAttribute("type", "password");
                    input2.setAttribute("placeholder", "Enter Password");
                    input2.setAttribute("id", "password");
                    input2.style.width = "100%";
                    input2.style.padding = "12px 12px";
                    input2.style.margin = "8px 0";
                    input2.style.display = "inline-block";
                    input2.style.boxSizing = "border-box";
                    loginDiv.appendChild(input2);


                    var submitDiv = document.createElement("div");
                    submitDiv.setAttribute("id", "submitdiv");
                    submitDiv.style.width = "100%";
                    submitDiv.style.height = "300px";
                    loginDiv.appendChild(submitDiv);

                    var submitButton = document.createElement("BUTTON");
                    submitButton.setAttribute("id", "submitbutton");
                    //submitButton.setAttribute("type", "button");
                    submitButton.style.backgroundColor = "#002D5A";
                    submitButton.style.color = "white";
                    submitButton.style.padding = "14px 20px";
                    submitButton.style.margin = "8px 0";
                    submitButton.style.border = "none";
                    submitButton.style.cursor = "pointer";
                    submitButton.style.width = "100%";
                    submitButton.innerHTML = "Login";
                    submitButton.onclick = function () {
                        loading(), validate()
                    };
                    submitDiv.appendChild(submitButton);

                    //LÃ¤sst den Login auch mit Enter durchfÃ¼hren
                    $(input2).keyup(function (event) {
                        if (event.keyCode == 13) {
                            $(submitButton).click();
                        }
                    });

                    $(input).keyup(function (event) {
                        if (event.keyCode == 13) {
                            $(submitButton).click();
                        }
                    });


                    /*var checkbox = document.createElement("input");
                     checkbox.setAttribute("id", "checkbox");
                     checkbox.setAttribute("type", "checkbox");
                     checkbox.setAttribute("checked", "checked");
                     checkbox.style.float = "left";
                     submitDiv.appendChild(checkbox);
                     var checkboxText = document.createTextNode("Remember me");
                     submitDiv.appendChild(checkboxText);
                     */
                }

                function validate() {
                    var uname = document.getElementById("username");
                    var pword = document.getElementById("password");
                    username = uname.value;
                    password = pword.value;
                    setCookie(username, password);
                    //alert(username + password);
                    zDaten = getCookie("Zugangsdaten");
                    testApiBuildDashboard();
                }

                /*function setCheckbox() {
                 var checkbox = document.getElementById("checkbox");
                 if ( checkbox.checked) {
                 rememberMe = true;
                 } else {
                 rememberMe = false;
                 }
                 }*/

                /*function checkRememberMe() {
                 if (rememberMe == false) {
                 deleteCookies();
                 }
                 }*/


                function buildFrame() {
                    var borderRadius = "3px";

                    popup.style.position = "absolute";
                    popup.style.resize = "vertical";
                    //popup.style.overflow = "auto";
                    //popup.style.overflowY = "scroll";
                    popup.style.top = "10px";
                    //popup.style.opacity ="0.9";
                    popup.style.filter = "alpha(opacity=50)";
                    popup.style.right = "10px";
                    popup.style.zIndex = "10000000";
                    popup.style.width = "410px";

                    if (isArticle) {
                        popup.style.maxHeight = "1400px";
                        popup.style.minHeight = "630px";
                    } else {
                        popup.style.maxHeight = "640px";
                        popup.style.minHeight = "640px";
                    }

                    popup.style.background = "white";
                    popup.style.boxShadow = "0px 0px 2px 0px rgba(50, 50, 50, 1)";
                    popup.style.direction = "ltr";
                    popup.style.borderRadius = borderRadius;

                    topdiv.style.height = "35px";

                    topdiv.style.position = "relative";
                    topdiv.style.zIndex = "10000";
                    topdiv.style.marginLeft = "0px";
                    topdiv.style.marginRight = "0px";
                    topdiv.style.marginTop = "0px";
                    topdiv.style.background = "#002D5A";
                    topdiv.style.borderBottom = "1px solid #00254A";
                    topdiv.style.boxShadow = "0px 3px 10px 0px rgba(100, 100, 100, 0.4)";
                    //topdiv.style.borderRadius = borderRadius;
                    topdiv.style.borderTopLeftRadius = borderRadius;
                    topdiv.style.borderTopRightRadius = borderRadius;

                    button.style.border = "none";
                    button.style.float = "right";
                    button.style.height = "30px";
                    button.style.width = "30px";
                    button.style.marginRight = "2px";
                    button.style.borderTopRightRadius = borderRadius;
                    //button.style.backgroundColor = "white";
                    var xIcon = document.createElement("div");
                    //xIcon.setAttribute("class", "fa fa-close");
                    xIcon.style.width = "100%";
                    xIcon.style.height = "100%";
                    xIcon.style.paddingTop = "3px";
                    xIcon.style.color = "white";
                    xIcon.style.fontSize = "20px";
                    xIcon.style.textAlign = "center";

                    xIcon.innerHTML = "&#9587";
                    button.appendChild(xIcon);

                    var p = document.createElement('div');
                    p.setAttribute("id", "p0");
                    p.style.fontFamily = "Helvetica-Light, Arial, sans-serif";
                    p.style.fontWeight = "100";
                    p.style.textAlign = "center";
                    p.style.fontSize = "18px";
                    p.style.color = "#F5F5F2";
                    p.style.background = "#002D5A";
                    p.style.marginTop = "9px";
                    //p.style.marginBottom = "3px";
                    p.style.marginLeft = "10px";
                    p.style.float = "left";
                    p.style.borderTopRightRadius = "10px";
                    p.innerHTML = "DW Bookmarklet";
                    topdiv.appendChild(p);

                    document.body.appendChild(popup);

                    popup.appendChild(topdiv);

                    //button.appendChild(text);
                    topdiv.appendChild(button);

                    button.onmousedown = function () {
                        this.style.opacity = '1';
                    };// on tapping
                    button.onmouseover = function () {
                        this.style.opacity = '0.8';
                    };
                    button.onmouseout = function () {
                        this.style.opacity = '1';
                    };

                    close.appendChild(button);
                    close.setAttribute('href', '#');
                    close.onclick = function () {

                        //Entfernen der Bubbles, falls diese vorhanden sind
                        // var bubbleElemente = document.getElementsByClassName("tooltip");
                        // console.log("Bubble Elemente:");
                        // console.log(bubbleElemente);
                        //
                        // if (bubbleElemente.length > 0) {
                        //     for (var i = 0; i < bubbleElemente.length; i++) {
                        //         bubbleElemente[i].parentNode.removeChild(bubbleElemente[i]);
                        //     }
                        //
                        // }

                        $('.bubble').remove();
                        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

                    };
                    void(topdiv.appendChild(close));

                }


                /*function loader(config) {
                    return function() {
                        var radius = Math.min(config.width, config.height) / 2;
                        var tau = 2 * Math.PI;

                        var arc = d3.svg.arc()
                            .innerRadius(radius*0.7)
                            .outerRadius(radius*0.9)
                            .startAngle(0);

                        var svg = d3.select(config.container).append("svg")
                            .attr("id", config.id)
                            .attr("width", "50px")
                            .attr("height", "50px")
                            //.style("margin-left", "165px")
                            .append("g")
                            .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")")


                        var background = svg.append("path")
                            .datum({endAngle: 0.33*tau})
                            .style("fill", "#002D5A")
                            .attr("d", arc)
                            .call(spin, 1500)

                        function spin(selection, duration) {
                            selection.transition()
                                .ease("linear")
                                .duration(duration)
                                .attrTween("transform", function() {
                                    return d3.interpolateString("rotate(0)", "rotate(360)");
                                });

                            setTimeout(function() { spin(selection, duration); }, duration);
                        }

                        function transitionFunction(path) {
                            path.transition()
                                .duration(7500)
                                .attrTween("stroke-dasharray", tweenDash)
                                .each("end", function() { d3.select(this).call(transition); });
                        }

                    };
                }*/


                function loading() {
                    var loaderContainer = document.createElement("div");
                    loaderContainer.setAttribute("id", "loaderContainer");
                    loaderContainer.style.textAlign = "center";
                    //loaderContainer.style.border = "solid black 1px";

                    // var checkboxtext = document.getElementById("checkboxtext");
                    // checkboxtext.parentNode.removeChild(checkboxtext);
                    var submitDiv = document.getElementById("submitdiv");
                    submitDiv.parentNode.removeChild(submitDiv);

                    var loginDiv = document.getElementById("login");
                    loginDiv.appendChild(loaderContainer);

                    /*var myLoader = loader({width: 50, height: 50, container: "#loaderContainer", id: "loaderCircle"});
                    myLoader();*/

                    loader();

                    var loadingTextDiv = document.createElement("div");
                    loadingTextDiv.setAttribute("id", "loadingTextDiv");
                    loadingTextDiv.style.width = "100%";
                    loadingTextDiv.style.textAlign = "center";
                    loaderContainer.appendChild(loadingTextDiv);
                    var loadingText = document.createTextNode(getLadeStatus() + "%");
                    loadingTextDiv.appendChild(loadingText);


                    // var loaderCircle = document.getElementById("loader");
                    // loaderCircle.style.marginLeft = "215px";

                }

                function removeLoader() {
                    var loaderCircle = document.getElementById("loaderContainer");
                    loaderCircle.parentNode.removeChild(loaderCircle);
                }

                function removeLogin() {
                    var login = document.getElementById("login");
                    login.parentNode.removeChild(login);
                }

                function wrongLoginData() {
                    var wrongData = document.createElement("div");
                    wrongData.setAttribute("id", "wrongdata");
                    wrongData.style.width = "360px";
                    //wrongData.style.height = "50px";
                    wrongData.style.backgroundColor = "#C5292D";
                    wrongData.style.color = "white";
                    wrongData.style.textAlign = "center";
                    wrongData.style.padding = "10px";
                    wrongData.style.marginBottom = "10px";
                    wrongData.innerHTML = "Wrong username or password";
                    removeLogin();
                    buildLogin();
                    var login = document.getElementById("login");
                    login.insertBefore(wrongData, login.childNodes[1]);
                }


                function moveDiv(div) {
                    var isDown = false;
                    topdiv.addEventListener('mousedown', function (e) {
                        isDown = true;
                        offset = [
                            div.offsetLeft - e.clientX,
                            div.offsetTop - e.clientY
                        ];
                    }, true);

                    document.addEventListener('mouseup', function () {
                        isDown = false;
                    }, true);

                    document.addEventListener('mousemove', function (event) {
                        event.preventDefault();
                        if (isDown) {
                            mousePosition = {

                                x: event.clientX,
                                y: event.clientY

                            };
                            div.style.left = (mousePosition.x + offset[0]) + 'px';
                            div.style.top = (mousePosition.y + offset[1]) + 'px';
                        }
                    }, true);
                }

                moveDiv(popup);


                function buildDashboard(//Ohne App (Auf Startseite)
                    visits_stunden_gestern,
                    visits_stunden_heute,
                    seitenaufrufe_gestern,
                    seitenaufrufe_heute,
                    quelle_gestern,
                    quelle_heute,
                    zugriff_gestern,
                    zugriff_heute,
                    land_gestern,
                    land_heute,
                    gesamtaufrufe_ohneApp_gestern, gesamtaufrufe_ohneApp_heute,
                    //Mit App (Auf Artikelseite)
                    land_app_gestern,
                    land_app_heute,
                    visits_stunden_app_gestern,
                    visits_stunden_app_heute,
                    zugriff_app_gestern,
                    zugriff_app_heute,
                    seitenaufrufe_app_gestern,
                    seitenaufrufe_app_heute) {

                    // FÃ¼r Testzwecke
                    // gesamtaufrufe_ohneApp_gestern.DataFeed[0].Rows.push({"m_visits": 10000});
                    // gesamtaufrufe_ohneApp_heute.DataFeed[0].Rows.push({"m_visits": 5000});


                    //Building the popup
                    //checkRememberMe();
                    removeLoader();
                    removeLogin();


                    popup.style.height = "auto";


                    var container = document.createElement('div');
                    container.setAttribute("id", "scroll-container");

                    var outerdiv = document.createElement('div');
                    outerdiv.setAttribute("id", "outerdiv");
                    outerdiv.style.height = "100%";
                    outerdiv.style.resize = "none";
                    var innerdiv0 = document.createElement('div');
                    var innerdiv1 = document.createElement('div');
                    var innerdiv5 = document.createElement('div');


                    var hLinie0 = document.createElement("hr");
                    var hLinie1 = document.createElement("hr");

                    var hLinie5 = document.createElement("hr");
                    var hLinie6 = document.createElement("hr");
                    var p0 = document.createElement('p');
                    var p1 = document.createElement('p');


                    // Die Ãœberschriften fÃ¼r die Diagramme definieren. Wir unterscheiden
                    // zwischen dem Startseiten und Artikelseiten-Bookmarklet.
                    if (isArticle) {
                        var headline0 = document.createTextNode("VERLAUF GESTERN UND HEUTE");
                        var headline1 = document.createTextNode("BESUCHE");
                        var headline2 = document.createTextNode("AUSSPIELUNG: MOBIL VS. DESKTOPANSICHT VS. APP");
                        var headline3 = document.createTextNode("WIE DER ARTIKEL GEFUNDEN WIRD");
                        var headline4 = document.createTextNode("WO DER ARTIKEL GELESEN WIRD");
                    } else {
                        var headline0 = document.createTextNode("Nutzung der Start- bzw. Rubrikseite (gestern und heute)");
                        var headline1 = document.createTextNode("Top 5 der hier gebuchten Artikel (gestern und heute)");
                    }

                    var dashboardText = document.createElement("p");
                    var dashboardlink = document.createElement("p");

                    //Logout Button
                    // var logoutButton = document.createElement("button");
                    // logoutButton.style.backgroundColor = "red";
                    // logoutButton.style.color = "white";
                    // logoutButton.style.background = "white";
                    // logoutButton.style.color = "#2F323A";
                    // logoutButton.style.fontSize = "20px";
                    // logoutButton.style.border = "0";
                    // //logoutButton.style.float = "right";
                    // logoutButton.style.height = "30px";
                    // logoutButton.style.cursor = "pointer";
                    // logoutButton.style.width = "80px";
                    // logoutButton.setAttribute("type", "button");
                    // logoutButton.innerHTML = "Logout";
                    // topdiv.appendChild(logoutButton);
                    // logoutButton.onmousedown = function(){this.style.backgroundColor = 'white';} // on tapping
                    // logoutButton.onmouseover = function(){this.style.backgroundColor = '#DCdCdC';}
                    // logoutButton.onmouseout = function(){this.style.backgroundColor = 'white';}
                    //close.appendChild(logoutButton);


                    innerdiv0.setAttribute("id", "innerdiv0");
                    innerdiv1.setAttribute("id", "innerdiv1");
                    innerdiv5.setAttribute("id", "innerdiv5");
                    p0.setAttribute("id", "p0");
                    p1.setAttribute("id", "p1");


                    var popupHeight = document.getElementById("popup").clientHeight;
                    var topdivHeight = document.getElementById("topdiv").clientHeight;

                    container.style.minHeight = "" + popupHeight - topdivHeight+ "px";
                    //container.style.maxHeight = "" + popupHeight - topdivHeight - 10 + "px";
                    container.style.height = "" + popupHeight - topdivHeight +"px";
                    container.style.width = "100%";

                    if(isArticle) {
                        container.style.overflow = "auto";
                        container.style.resize = "vertical";
                    }
                    //container.style.position = "relative";
                    //container.style.display = "inline-block";

                    innerdiv0.style.marginLeft = "10px";
                    innerdiv0.style.marginRight = "10px";
                    innerdiv0.style.marginTop = "30px";
                    //innerdiv0.style.background = "#FFFAF0";
                    innerdiv0.style.height = "auto";

                    innerdiv1.style.marginLeft = "10px";
                    innerdiv1.style.marginRight = "10px";
                    innerdiv1.style.marginTop = "0px";
                    innerdiv1.style.background = "white";

                    innerdiv5.style.background = "white";
                    innerdiv5.style.marginTop = "30px";
                    innerdiv5.style.marginLeft = "10px";
                    innerdiv5.style.marginRight = "10px";
                    innerdiv5.style.marginBottom = "10px";

                    function setLine(line) {
                        line.style.border = "none";
                        line.style.height = "1px";
                        line.style.background = "silver";
                    }

                    setLine(hLinie0);
                    setLine(hLinie1);
                    setLine(hLinie5);
                    setLine(hLinie6);


                    function setParagraph(p) {
                        p.style.fontFamily = "Arial";
                        p.style.textAlign = "left";
                        p.style.fontSize = "14px";
                        p.style.fontWeight = "bold";
                        p.style.color = "#002D5A";
                        p.style.background = "white";
                        p.style.marginTop = "20px";
                        p.style.marginBottom = "0";
                    }

                    setParagraph(p0);
                    setParagraph(p1);

                    dashboardText.style.fontSize = "12px";
                    dashboardText.style.fontFamily = "Arial";
                    dashboardText.style.fontWeight = "500";
                    dashboardText.style.color = "#002D5A";

                    if (isArticle) {
                        dashboardText.innerHTML = "Hinweis: Das DW Bookmarklet stellt die Nutzung des aufgerufenen Artikels auf " +
                            "<b>(m.)dw.com und den DW Apps</b> fÃ¼r den Zeitraum gestern und heute dar.";
                    } else {
                        dashboardText.innerHTML = "Hinweis: Das DW Bookmarklet stellt an dieser Stelle die Nutzung der aufgerufenen " +
                            "Start- bzw. Rubrikseite auf <b>(m.)dw.com</b> fÃ¼r den Zeitraum gestern und heute dar.";
                    }

                    dashboardText.style.innerHeight = "1";
                    dashboardlink.style.fontSize = "10px";
                    dashboardlink.style.fontFamily = "Arial";
                    dashboardlink.style.color = "#002D5A";
                    dashboardlink.innerHTML = "Unter diesem Link finden Sie weitere aktuelle Onlinenutzungsdaten " +
                        "&uumlbersichtlich dargestellt im <a href='https://apps.atinternet-solutions.com/Dashboard/Viewer' target='_blank'>" +
                        "Dashboard der DW</a>. Das Dashboard bietet die Moeglichkeit, Daten f&uumlr verschiedene Zeitfenster " +
                        "auszugeben, u.a. letzte 5 Minuten, letzte 10 Minuten, letzte Stunde oder f&uumlr mehrere Tage/Wochen/Monate.";
                    dashboardlink.style.innerHeight = "1";

                    popup.appendChild(container);
                    container.appendChild(outerdiv);

                    outerdiv.appendChild(innerdiv0);
                    outerdiv.appendChild(innerdiv1);

                    innerdiv5.appendChild(hLinie5);

                    p0.appendChild(headline0);
                    innerdiv0.appendChild(p0);
                    p0.appendChild(hLinie0);

                    p1.appendChild(headline1);
                    innerdiv1.appendChild(p1);
                    p1.appendChild(hLinie1);

                    innerdiv5.appendChild(dashboardText);
                    dashboardText.appendChild(hLinie6);

                    innerdiv5.appendChild(dashboardlink);

                    // Falls es sich um einen Artikel handelt, werden diese Elemente erzeugt
                    if (isArticle) {
                        var innerdiv2 = document.createElement('div');
                        var innerdiv3 = document.createElement('div');
                        var innerdiv4 = document.createElement('div');
                        var hLinie2 = document.createElement("hr");
                        var hLinie3 = document.createElement("hr");
                        var hLinie4 = document.createElement("hr");
                        var p2 = document.createElement('p');
                        var p3 = document.createElement('p');
                        var p4 = document.createElement('p');
                        innerdiv2.setAttribute("id", "innerdiv2");
                        innerdiv3.setAttribute("id", "innerdiv3");
                        innerdiv4.setAttribute("id", "innerdiv4");
                        p2.setAttribute("id", "p2");
                        p3.setAttribute("id", "p3");
                        p4.setAttribute("id", "p4");

                        innerdiv2.style.marginLeft = "10px";
                        innerdiv2.style.marginRight = "10px";
                        innerdiv2.style.background = "white";

                        innerdiv3.style.marginLeft = "10px";
                        innerdiv3.style.marginRight = "10px";
                        innerdiv3.style.background = "white";

                        innerdiv4.style.marginLeft = "10px";
                        innerdiv4.style.marginRight = "10px";
                        innerdiv4.style.background = "white";

                        setLine(hLinie2);
                        setLine(hLinie3);
                        setLine(hLinie4);

                        setParagraph(p2);
                        setParagraph(p3);
                        setParagraph(p4);

                        p2.appendChild(headline2);
                        innerdiv2.appendChild(p2);
                        p2.appendChild(hLinie2);

                        p3.appendChild(headline3);
                        innerdiv3.appendChild(p3);
                        p3.appendChild(hLinie3);

                        p4.appendChild(headline4);
                        innerdiv4.appendChild(p4);
                        p4.appendChild(hLinie4);

                        outerdiv.appendChild(innerdiv2);
                        outerdiv.appendChild(innerdiv3);
                        outerdiv.appendChild(innerdiv4);

                    }


                    outerdiv.appendChild(innerdiv5);


                    //Liniendiagramm Tagesverlauf Gestern und Heute
                    var appGestern = visits_stunden_app_gestern;
                    var appHeute = visits_stunden_app_heute;
                    var gestern = visits_stunden_gestern;
                    var heute = visits_stunden_heute;


                    //Seitenaufrufe Gestern und Gestern-App addieren und neuen Array ausgeben
                    var data_gestern = {
                        item: []
                    };

                    //App-Daten nur bei Artikeln
                    if (isArticle) {
                        for (var i in appGestern.DataFeed[0].Rows) {
                            data_gestern.item.push({
                                "key": appGestern.DataFeed[0].Rows[i].d_time_hour_event,
                                "val": appGestern.DataFeed[0].Rows[i].m_visits
                            });

                        }
                    }

                    for (var i in gestern.DataFeed[0].Rows) {
                        data_gestern.item.push({
                            "key": gestern.DataFeed[0].Rows[i].d_time_hour_event,
                            "val": gestern.DataFeed[0].Rows[i].m_visits
                        });
                    }
                    //console.log("Gestern");
                    //console.log(data_gestern);

                    let countssssss = data_gestern.item.reduce((prev, curr) => {
                            let count = prev.get(curr.key) || 0;
                            prev.set(curr.key, curr.val + count);
                            return prev;
                        },
                        new Map()
                        )
                    ;

                    let reducedGestern = [...countssssss
                        ].map(([key, value]) => {
                            return {key, value}
                        }
                        )
                    ;
                    //console.log("Gestern reduced");
                    //console.log(reducedGestern);

                    reducedGestern.sort(function (a, b) {
                        return a.key - b.key;
                    });


                    var data_heute = {
                        item: []
                    };

                    if (isArticle) {
                        for (var i in appHeute.DataFeed[0].Rows) {
                            data_heute.item.push({
                                "key": appHeute.DataFeed[0].Rows[i].d_time_hour_event,
                                "val": appHeute.DataFeed[0].Rows[i].m_visits
                            });

                        }
                    }
                    for (var i in heute.DataFeed[0].Rows) {
                        data_heute.item.push({
                            "key": heute.DataFeed[0].Rows[i].d_time_hour_event,
                            "val": heute.DataFeed[0].Rows[i].m_visits
                        });
                    }
                    //console.log("Heute");
                    //console.log(data_heute);

                    let counts1 = data_heute.item.reduce((prev, curr) => {
                            let count = prev.get(curr.key) || 0;
                            prev.set(curr.key, curr.val + count);
                            return prev;
                        },
                        new Map()
                        )
                    ;

                    let reducedHeute = [...counts1
                        ].map(([key, value]) => {
                            return {key, value}
                        }
                        )
                    ;
                    //console.log("Heute reduced");
                    //console.log(reducedHeute);

                    reducedHeute.sort(function (a, b) {
                        return a.key - b.key;
                    });


                    //Pruefe ob Array 24 Stunden Einheiten hat
                    var gestern = reducedGestern.concat();

                    for (var i = 0; i <= 23; i++) {
                        if (gestern[i] == undefined || gestern[i].key != i) {
                            gestern.splice(i, 0, {key: i, value: 0});
                        }
                        ;
                    }
                    //console.log("gestern");
                    //console.log(gestern);

                    //Pruefe ob Array alle Stunden bis zur jetzigen Uhrzeit beinhaltet
                    var heute = reducedHeute.concat();

                    for (var i = 0; i <= time; i++) {
                        if (heute[i] == undefined || heute[i].key != i) {
                            heute.splice(i, 0, {key: i, value: 0});
                        }
                        ;
                    }
                    //console.log("Heute");
                    //console.log(heute);

                    // //Stunden von heute + 24
                    for (var i = 0; i <= time; i++) {
                        heute[i].key = i + 24;
                    }
                    ;

                    //console.log("Heute + 24");
                    //console.log(heute);


                    var data = gestern.concat(heute);
                    //console.log("concat");
                    //console.log(data);

                    var d = new Date();
                    var hours = d.getHours();
                    //console.log("Aktuelle Zeit: " + d);
                    //console.log("Aktuelle Stunden: " + hours);

                    //Gibt die X Skala von Gestern 0 Uhr bis jetzt aus
                    var minus24 = d3.time.hour.offset(d, -24);
                    //console.log("-24 Std: " + minus24)

                    yesterday = d3.time.hour.offset(minus24, -hours);

                    //console.log("Gestern: " + yesterday);


                    function setDate() {
                        //Ein weiterer Value im Array (1-24, 1-Aktuelle Uhrzeit), falls man diese fÃ¼r die Stundenzahl im Array benutzen will
                        for (var i = 0; i < 24; i++) {
                            var d2 = new Date();
                            var hours = d2.getHours();
                            var dMinus24 = d3.time.hour.offset(d2, -24);
                            yesterd = d3.time.hour.offset(dMinus24, -hours);

                            yesterd.setHours(i);
                            data[i].date = yesterd;
                            //console.log("Zeit " + i + "= " + yesterd);
                        }
                        for (var i = 0; i <= time; i++) {
                            var di = new Date();

                            di.setHours(i);
                            data[i + 24].date = di;
                            //console.log("Zeit " + i + "= " + di);
                        }

                        //console.log("Date hinzugefÃ¼gt");
                        //console.log(data);

                    }

                    setDate();

                    function setNullwerte() {
                        //Einen letzten Nullwert hinzufÃ¼gen, damit das Diagramm gefÃ¼llt werden kann und mit der Achse abschlieÃŸt
                        data.push({
                            "key": data.length - 1, "value": 0, "date": new Date()
                        });

                        //Nullwert setzen am ersten Value > 0
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].value != yesterday) {
                                data.splice(i, 0, {key: 0, value: 0, date: yesterday});
                                break;
                            }
                        }
                    }

                    setNullwerte();
                    //console.log("concat + nullwert");
                    //console.log(data);

                    var margin1 = {top: 25, right: 20, bottom: 50, left: 50},
                        width1 = 380 - margin1.left - margin1.right,
                        height1 = 200 - margin1.top - margin1.bottom;


                    var xScale1 = d3.scale.linear()
                        .domain([0, d3.max(data, function (d) {
                            return d.key;
                        })])
                        .range([0, width1]);

                    var yScale1 = d3.scale.linear()
                        .domain([0, d3.max(data, function (d) {
                            return d.value;
                        })])
                        .range([height1, 0]);

                    var xAxis1 = d3.svg.axis()
                        .scale(xScale1)
                        .orient("bottom")
                        //.ticks(6)
                        .innerTickSize(5)
                        .outerTickSize(0)
                        .tickPadding(10);


                    // Define your time scale
                    var xScale = d3.time.scale()
                        .domain([yesterday, d])
                        //.nice(d3.time.week)
                        .range([0, width1]);


                    var xAxis12 = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(12)
                        .tickFormat(d3.time.format("%H"))
                        .innerTickSize(5)
                        .outerTickSize(0)
                        .tickPadding(10);

                    var yAxis1 = d3.svg.axis()
                        .scale(yScale1)
                        .orient("left")
                        .ticks(5)
                        .innerTickSize(-width1)
                        .outerTickSize(0)
                        .tickPadding(10);

                    var line = d3.svg.line()
                        .x(function (d) {
                            return xScale(d.date);
                        })
                        .y(function (d) {
                            return yScale1(d.value);
                        })
                        .interpolate("linear");

                    var svg = d3.select("#innerdiv0").append("svg")
                        .attr("width", width1 + margin1.left + margin1.right)
                        .attr("height", height1 + margin1.top + margin1.bottom)
                        .append("g")
                        .attr("font-family", "Helvetica")
                        .attr("font-size", "10px")
                        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");


                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height1 + ")")
                        .call(xAxis12);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis1);


                    function trennungslinie() {
                        var date = new Date();
                        date.setHours(0);
                        date.setMinutes(0);
                        //console.log("0 Uhr: " + date);

                        var trennLinie = [
                            {date: date, value: 0},
                            {
                                date: date, value: d3.max(data, function (d) {
                                    return d.value;
                                })
                            }
                        ];

                        var line2 = d3.svg.line()
                            .x(function (d) {
                                return xScale(d.date);
                            })
                            .y(function (d) {
                                return yScale1(d.value);
                            });

                        svg.append("path")
                            .data([trennLinie])
                            .attr("class", "line")
                            .attr("d", line2)
                            .attr("fill", "none")
                            .attr("opacity", 1)
                            .attr("stroke", "#dadada")
                            .attr("stroke.width", 1);
                    }

                    trennungslinie();


                    //#002D5A #b0C4de
                    var path = svg.append("path")
                        .data([data])
                        .attr("class", "line")
                        .attr("d", line)
                        .attr("stroke", "#07447E")
                        .attr("opacity", "0")
                        .attr("stroke-width", 0)
                        .attr("fill", "none");



                    var totalLength = path.node().getTotalLength();

                    // path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    //     .attr("stroke-dashoffset", totalLength)
                    //     .transition()
                    //     .duration(2000)
                    //     .ease("linear")
                    //     .attr("stroke-dashoffset", 0);

                    path.attr("fill", "#b0C4de")
                        .transition()
                        .duration(0)
                        .attr("opacity", 0.7);



                    // path.transition().delay(2000)
                    //     .attr("fill", "#b0C4de");
                    //.transition()
                    //.duration(0)
                    //.attr("fill", "rgba(7,68,126,0.31)")
                    ;


                    d3.selectAll(".axis path, .axis line")
                        .style("fill", "none")
                        .style("stroke", "#dadada");

                    svg.append("text")
                        .attr("class", "title")
                        .attr("x", 160)
                        .attr("y", 175)
                        .attr("text-anchor", "left")
                        .attr("font-family", "Helvetica")
                        .style("font-size", "12px")
                        .style("color", "#696969")
                        //.style("font-weight", "bold")
                        .text('Gestern 0 Uhr bis ' + time + ' Uhr Heute');

                    svg.append("text")
                        .attr("class", "title")
                        .attr("x", -40)
                        .attr("y", 5 - (margin.top / 2))
                        .attr("text-anchor", "left")
                        .attr("font-family", "Helvetica")
                        .style("font-size", "12px")
                        .style("color", "#696969")
                        //.style("font-weight", "bold")
                        .text('Visits');


                    if (isArticle) {
                        var gesamtaufrufe = PageImpressionsTable(seitenaufrufe_gestern, seitenaufrufe_heute, seitenaufrufe_app_gestern, seitenaufrufe_app_heute);
                        DevicesPieChart(quelle_gestern, quelle_heute, seitenaufrufe_app_gestern, seitenaufrufe_app_heute, gesamtaufrufe);
                        CountryChart(land_gestern, land_heute, land_app_gestern, land_app_heute);
                        AccessChart(zugriff_gestern, zugriff_heute, zugriff_app_gestern, zugriff_app_heute);
                    }


                    //Zum Schluss werden noch die Blasen erzeugt
                    function getRankdrawBubbles() {

                        var rankBtn = document.createElement("div");

                        rankBtn.setAttribute("id", "rankBtn");
                        //submitButton.setAttribute("type", "button");
                        rankBtn.style.backgroundColor = "#002D5A";
                        rankBtn.style.color = "white";
                        rankBtn.style.padding = "14px 20px";
                        rankBtn.style.margin = "8px 0";
                        rankBtn.style.border = "none";
                        rankBtn.style.borderRadius = "5px";
                        rankBtn.style.cursor = "pointer";
                        rankBtn.style.width = "350px";
                        rankBtn.innerHTML = "Anzeigen der Top-Artikelnutzung";
                        rankBtn.onclick = function () {
                            rank(zDaten), createLoader()
                        };
                        innerdiv1.appendChild(rankBtn);

                        function createLoader() {
                            var loaderDiv = document.createElement("div");
                            loaderDiv.setAttribute("class", "loader");
                            loaderDiv.style.marginLeft = "40%";

                            innerdiv1.appendChild(loaderDiv);
                        }

                    }

                    if (!isArticle) {
                        //getRankdrawBubbles();
                        rank(zDaten);
                    }


                }


                function testApiBuildDashboard() {


                    $.ajax({
                            url: api_visits_stunden_gestern,
                            async: true,
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                            },
                            success: function (visits_stunden_gestern) {
                                console.log(api_visits_stunden_gestern);
                                console.log("We got response! Data visits_stunden_gestern");
                                console.log(visits_stunden_gestern);
                                setLadeStatus();
                                buildLoadingText();


                                $.ajax({
                                    url: api_visits_stunden_heute,
                                    async: true,
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                    },
                                    success: function (visits_stunden_heute) {
                                        console.log("We got response! Data visits_stunden_heute");
                                        console.log(visits_stunden_heute);
                                        setLadeStatus();
                                        buildLoadingText();


                                        //App-Daten werden nur auf Artikelseiten benÃ¶tigt
                                        //ÃœberprÃ¼fen, ob es sich um ein Artikel handelt
                                        if (isArticle) {
                                            $.ajax({
                                                url: api_visits_gestern,
                                                async: true,
                                                beforeSend: function (xhr) {
                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                },
                                                success: function (seitenaufrufe_gestern) {
                                                    //alert("Einloggen erfolgreich!");
                                                    console.log("We got response! Data seitenaufrufe_gestern");
                                                    console.log(seitenaufrufe_gestern);
                                                    setLadeStatus();
                                                    buildLoadingText();


                                                    $.ajax({
                                                        url: api_visits_heute,
                                                        async: true,
                                                        beforeSend: function (xhr) {
                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                        },
                                                        success: function (seitenaufrufe_heute) {
                                                            console.log("We got response! Data seitenaufrufe_heute");
                                                            console.log(seitenaufrufe_heute);
                                                            setLadeStatus();
                                                            buildLoadingText();


                                                            $.ajax({
                                                                url: api_gesamtaufrufe_heute_ohne_app,
                                                                async: true,
                                                                beforeSend: function (xhr) {
                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                },
                                                                success: function (gesamtaufrufe_heute_ohne_app) {
                                                                    console.log("We got response! Data gesamtaufrufe_heute_ohne_app");
                                                                    console.log(gesamtaufrufe_heute_ohne_app);
                                                                    setLadeStatus();
                                                                    buildLoadingText();


                                                                    $.ajax({
                                                                        url: api_gesamtaufrufe_gestern_ohne_app,
                                                                        async: true,
                                                                        beforeSend: function (xhr) {
                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                        },
                                                                        success: function (gesamtaufrufe_gestern_ohne_app) {
                                                                            console.log("We got response! Data gesamtaufrufe_gestern_ohne_app");
                                                                            console.log(gesamtaufrufe_gestern_ohne_app);
                                                                            setLadeStatus();
                                                                            buildLoadingText();


                                                                            $.ajax({
                                                                                url: api_quelle_gestern,
                                                                                async: true,
                                                                                beforeSend: function (xhr) {
                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                },
                                                                                success: function (quelle_gestern) {
                                                                                    console.log("We got response! Data Quelle_gestern");
                                                                                    console.log(quelle_gestern);
                                                                                    console.log(api_quelle_gestern);
                                                                                    setLadeStatus();
                                                                                    buildLoadingText();


                                                                                    $.ajax({
                                                                                        url: api_quelle_heute,
                                                                                        async: true,
                                                                                        beforeSend: function (xhr) {
                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                        },
                                                                                        success: function (quelle_heute) {
                                                                                            console.log("We got response! Data Quelle_heute");
                                                                                            console.log(quelle_heute);
                                                                                            console.log(api_quelle_heute);
                                                                                            setLadeStatus();
                                                                                            buildLoadingText();


                                                                                            $.ajax({
                                                                                                url: api_zugriff_gestern,
                                                                                                async: true,
                                                                                                beforeSend: function (xhr) {
                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                },
                                                                                                success: function (zugriff_gestern) {
                                                                                                    console.log("We got response! Data zugriff_gestern");
                                                                                                    console.log(zugriff_gestern);
                                                                                                    setLadeStatus();
                                                                                                    buildLoadingText();


                                                                                                    $.ajax({
                                                                                                        url: api_zugriff_heute,
                                                                                                        async: true,
                                                                                                        beforeSend: function (xhr) {
                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                        },
                                                                                                        success: function (zugriff_heute) {
                                                                                                            console.log("We got response! Data zugriff_heute");
                                                                                                            console.log(zugriff_heute);
                                                                                                            setLadeStatus();
                                                                                                            buildLoadingText();


                                                                                                            $.ajax({
                                                                                                                url: api_land_gestern,
                                                                                                                async: true,
                                                                                                                beforeSend: function (xhr) {
                                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                },
                                                                                                                success: function (land_gestern) {
                                                                                                                    console.log("We got response! Data land_gestern");
                                                                                                                    console.log(land_gestern);
                                                                                                                    setLadeStatus();
                                                                                                                    buildLoadingText();


                                                                                                                    $.ajax({
                                                                                                                        url: api_land_heute,
                                                                                                                        async: true,
                                                                                                                        beforeSend: function (xhr) {
                                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                        },
                                                                                                                        success: function (land_heute) {
                                                                                                                            console.log("We got response! Data land_heute");
                                                                                                                            console.log(land_heute);
                                                                                                                            setLadeStatus();
                                                                                                                            buildLoadingText();


                                                                                                                            $.ajax({
                                                                                                                                url: api_visits_stunden_app_gestern,
                                                                                                                                async: true,
                                                                                                                                beforeSend: function (xhr) {
                                                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                },
                                                                                                                                success: function (visits_stunden_app_gestern) {
                                                                                                                                    console.log("We got response! Data visits_stunden_app_gestern");
                                                                                                                                    console.log(visits_stunden_app_gestern);
                                                                                                                                    setLadeStatus();
                                                                                                                                    buildLoadingText();


                                                                                                                                    $.ajax({
                                                                                                                                        url: api_visits_stunden_app_heute,
                                                                                                                                        async: true,
                                                                                                                                        beforeSend: function (xhr) {
                                                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                        },
                                                                                                                                        success: function (visits_stunden_app_heute) {
                                                                                                                                            console.log("We got response! Data visits_stunden_app_heute");
                                                                                                                                            console.log(visits_stunden_app_heute);
                                                                                                                                            setLadeStatus();
                                                                                                                                            buildLoadingText();


                                                                                                                                            $.ajax({
                                                                                                                                                url: api_zugriff_app_gestern,
                                                                                                                                                async: true,
                                                                                                                                                beforeSend: function (xhr) {
                                                                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                },
                                                                                                                                                success: function (zugriff_app_gestern) {
                                                                                                                                                    console.log("We got response! Data zugriff_app_gestern");
                                                                                                                                                    console.log(zugriff_app_gestern);
                                                                                                                                                    setLadeStatus();
                                                                                                                                                    buildLoadingText();


                                                                                                                                                    $.ajax({
                                                                                                                                                        url: api_zugriff_app_heute,
                                                                                                                                                        async: true,
                                                                                                                                                        beforeSend: function (xhr) {
                                                                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                        },
                                                                                                                                                        success: function (zugriff_app_heute) {
                                                                                                                                                            console.log("We got response! Data zugriff_app_heute");
                                                                                                                                                            console.log(zugriff_app_heute);
                                                                                                                                                            setLadeStatus();
                                                                                                                                                            buildLoadingText();


                                                                                                                                                            $.ajax({
                                                                                                                                                                url: api_land_app_gestern,
                                                                                                                                                                async: true,
                                                                                                                                                                beforeSend: function (xhr) {
                                                                                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                                },
                                                                                                                                                                success: function (land_app_gestern) {
                                                                                                                                                                    console.log("We got response! Data land_app_gestern");
                                                                                                                                                                    console.log(land_app_gestern);
                                                                                                                                                                    setLadeStatus();
                                                                                                                                                                    buildLoadingText();


                                                                                                                                                                    $.ajax({
                                                                                                                                                                        url: api_land_app_heute,
                                                                                                                                                                        async: true,
                                                                                                                                                                        beforeSend: function (xhr) {
                                                                                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                                        },
                                                                                                                                                                        success: function (land_app_heute) {
                                                                                                                                                                            console.log("We got response! Data land_app_heute");
                                                                                                                                                                            console.log(land_app_heute);
                                                                                                                                                                            setLadeStatus();
                                                                                                                                                                            buildLoadingText();


                                                                                                                                                                            $.ajax({
                                                                                                                                                                                url: api_visits_app_gestern,
                                                                                                                                                                                async: true,
                                                                                                                                                                                beforeSend: function (xhr) {
                                                                                                                                                                                    xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                                                },
                                                                                                                                                                                success: function (seitenaufrufe_app_gestern) {
                                                                                                                                                                                    console.log("We got response! Data seitenaufrufe_app_gestern");
                                                                                                                                                                                    console.log(seitenaufrufe_app_gestern);
                                                                                                                                                                                    setLadeStatus();
                                                                                                                                                                                    buildLoadingText();


                                                                                                                                                                                    $.ajax({
                                                                                                                                                                                        url: api_visits_app_heute,
                                                                                                                                                                                        async: true,
                                                                                                                                                                                        beforeSend: function (xhr) {
                                                                                                                                                                                            xhr.setRequestHeader("Authorization", "Basic " + btoa(zDaten));
                                                                                                                                                                                        },
                                                                                                                                                                                        success: function (seitenaufrufe_app_heute) {
                                                                                                                                                                                            console.log("We got response! Data seitenaufrufe_app_heute");
                                                                                                                                                                                            console.log(seitenaufrufe_app_heute);
                                                                                                                                                                                            setLadeStatus();
                                                                                                                                                                                            buildLoadingText();


                                                                                                                                                                                            //Hier wird das Dashboard aufgerufen.

                                                                                                                                                                                            setTimeout(function () {
                                                                                                                                                                                                buildDashboard(
                                                                                                                                                                                                    visits_stunden_gestern,
                                                                                                                                                                                                    visits_stunden_heute,
                                                                                                                                                                                                    seitenaufrufe_gestern,
                                                                                                                                                                                                    seitenaufrufe_heute,
                                                                                                                                                                                                    quelle_gestern,
                                                                                                                                                                                                    quelle_heute,
                                                                                                                                                                                                    zugriff_gestern,
                                                                                                                                                                                                    zugriff_heute,
                                                                                                                                                                                                    land_gestern,
                                                                                                                                                                                                    land_heute,
                                                                                                                                                                                                    gesamtaufrufe_gestern_ohne_app,
                                                                                                                                                                                                    gesamtaufrufe_heute_ohne_app,
                                                                                                                                                                                                    land_app_gestern, land_app_heute,
                                                                                                                                                                                                    visits_stunden_app_gestern,
                                                                                                                                                                                                    visits_stunden_app_heute,
                                                                                                                                                                                                    zugriff_app_gestern,
                                                                                                                                                                                                    zugriff_app_heute,
                                                                                                                                                                                                    seitenaufrufe_app_gestern,
                                                                                                                                                                                                    seitenaufrufe_app_heute);
                                                                                                                                                                                            }, 1000);

                                                                                                                                                                                        },
                                                                                                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                                                            //keineDaten();
                                                                                                                                                                                        }
                                                                                                                                                                                    });

                                                                                                                                                                                },
                                                                                                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                                                    //keineDaten();
                                                                                                                                                                                }
                                                                                                                                                                            });

                                                                                                                                                                        },
                                                                                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                                            //keineDaten();
                                                                                                                                                                        }
                                                                                                                                                                    });


                                                                                                                                                                },
                                                                                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                                    //keineDaten();
                                                                                                                                                                }
                                                                                                                                                            });

                                                                                                                                                        },
                                                                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                            //keineDaten();
                                                                                                                                                        }
                                                                                                                                                    });

                                                                                                                                                },
                                                                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                                    //keineDaten();
                                                                                                                                                }
                                                                                                                                            });

                                                                                                                                        },
                                                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                            //keineDaten();
                                                                                                                                        }
                                                                                                                                    });

                                                                                                                                },
                                                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                                    //keineDaten();
                                                                                                                                }
                                                                                                                            });


                                                                                                                        },
                                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                            //keineDaten();
                                                                                                                        }
                                                                                                                    });
                                                                                                                },
                                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                                    //keineDaten();
                                                                                                                }
                                                                                                            });


                                                                                                        },
                                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                            //keineDaten();
                                                                                                        }
                                                                                                    });

                                                                                                },
                                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                                    //keineDaten();
                                                                                                }
                                                                                            });

                                                                                        },
                                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                            //keineDaten();
                                                                                        }
                                                                                    });

                                                                                }
                                                                                ,
                                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                                    //keineDaten();
                                                                                }
                                                                            });

                                                                        },
                                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                            //keineDaten();
                                                                        }
                                                                    });

                                                                },
                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                                    //keineDaten();
                                                                }
                                                            });

                                                        },
                                                        error: function (jqXHR, textStatus, errorThrown) {
                                                            showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                            //keineDaten();
                                                        }
                                                    });

                                                },
                                                error: function (jqXHR, textStatus, errorThrown) {
                                                    showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                                    //keineDaten();
                                                }
                                            });

                                            //Falls es sich um die Startseite handelt, werden nur die Visits ohne App Ã¼bergeben.
                                        }
                                        else {
                                            setTimeout(
                                                function () {
                                                    buildDashboard(visits_stunden_gestern, visits_stunden_heute);
                                                },
                                                1000);
                                        }

                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                        //keineDaten();
                                    }
                                });

                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                deleteCookies();
                                showError("Leider kamen von AT Internet keine Daten.", textStatus, errorThrown);
                                //localStorage.clear();
                                removeLoader();
                                wrongLoginData();
                                //alert("Falscher Username oder Passwort!");

                            }
                        }
                    );

                }
            }
        }
    ;

// this.invoke = function () {
//   alert("Das DW Bookmarklet steht aktuell nicht zur VerfÃ¼gung.\nWir arbeiten derzeit daran, Ihnen dieses Service schnellstmÃ¶glich wieder zur VerfÃ¼gung stellen zu kÃ¶nnen.\nWir bitten Sie um Geduld, bis die Daten wieder korrekt dargestellt werden kÃ¶nnen und entschuldigen uns fÃ¼r die Unannehmlichkeiten.");
//   return;
    this.invoke = function () {
        if (!initialized) {
            initialized = true;
            this.init();
        }
        setTimeout(function () {
            window.wissBmControl.invoke()
        }, 20);
    };


    this.init = function () {
        var that = this;
        var jqLoader = document.createElement('script');
        jqLoader.id = "jqLoader";
        jqLoader.src = "https://code.jquery.com/jquery-3.1.1.min.js";
        jqLoader.onload = function () {
            var wiss$ = jQuery.noConflict(true);
            (function ($) {
                // jQuery is all set now
                $.getScript("https://d3js.org/d3.v3.min.js", function () {
                    // And now we have D3
                    // We recreate the invoke function in this closure and invoke it
                    that.invoke = createInvoke();
                });
            })(wiss$);
        };
        document.body.appendChild(jqLoader);
    }


})
();