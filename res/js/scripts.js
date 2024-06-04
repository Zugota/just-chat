var toastList = [];
var toastBottomOffset = 70;

function toastMessage(type, message, duration) {
    var newTL = [];
    var color = "";
    var fileName = "";
    if (type === 0) {
        color = "#ff8369";
        fileName = "error.svg";
    } else if (type === 1) {
        color = "#ffaa00";
        fileName = "warning.svg";
    } else {
        color = "#1198F6";
        fileName = "info.svg";
    }
    for (i = 0; i < toastList.length; i++) {
        if (toastList[i].style.display === "block") {
            newTL.push(toastList[i]);
        }
    }
    toastList = newTL;
    for (i = 0; i < toastList.length; i++) {
        var toastEnt = toastList[i];
        var bottomStr = toastEnt.style.bottom;
        bottomStr = bottomStr.replace("px", "");
        toastEnt.style.bottom = (parseInt(bottomStr) + toastBottomOffset) + "px";
        toastEnt.style.opacity = (parseFloat(toastEnt.style.opacity) * 0.7);
    }
    var toastDiv = document.createElement("div");
    toastDiv.classList.add("Toast");
    toastDiv.style.bottom = toastBottomOffset + "px";
    toastDiv.style.color = color;
    toastDiv.style["box-shadow"] = ("0px 0px 10px " + toastDiv.style.color);
    toastDiv.style.display = "block";
    toastDiv.style.opacity = "1.0";
    toastDiv.id = ("toast-" + Math.random());

    var toastIcon = document.createElement("img");
    toastIcon.src = fileName;
    toastIcon.style["vertical-align"] = "middle";
    toastIcon.style["margin-right"] = "10px";
    toastIcon.style.width = "20px";
    toastIcon.style.height = "20px";

    var toastContent = document.createElement("div");
    toastContent.classList.add("ToastContent");

    var toastText = document.createElement("label");
    toastText.innerHTML = message;

    toastContent.appendChild(toastIcon);
    toastContent.appendChild(toastText);

    toastDiv.appendChild(toastContent);
    document.body.appendChild(toastDiv);
    toastList.push(toastDiv);
    setTimeout(function () {
        if (toastList.length != 0) {
            var child = document.getElementById(arguments[0]);
            if (child != null) {
                child.style.display = "none";
                document.body.removeChild(child);
            }
        }
    }, duration, toastDiv.id);
}

function login() {
    var us = document.getElementById("username").value;
    var ps = document.getElementById("password").value;
    var rm = document.getElementById("loginRememberMe").getAttribute("selected");
    var data = JSON.stringify({username: us, password: ps, rememberMe: rm});
    var request = new XMLHttpRequest();
    request.open('POST', "/login-helper", true);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var resp = request.responseText;
            var split = resp.split("\n");
            if ("Yes".localeCompare(split[0]) === 0) {
                window.location.href = split[1];
            } else {
                toastMessage(0, split[1], 3000);
            }
        }
    };
    request.setRequestHeader("Content-type", "application/json");
    request.send(data);
}

function signup() {
    console.log("signup");
    var fn = document.getElementById("firstname").value;
    var ln = document.getElementById("lastname").value;
    var us = document.getElementById("username").value;
    var ps = document.getElementById("password").value;
    var rm = document.getElementById("signupRememberMe").getAttribute("selected");
    var data = JSON.stringify({firstname: fn, lastname: ln, username: us, password: ps, rememberMe: rm});
    var request = new XMLHttpRequest();
    request.open('POST', "/signup-helper", true);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var resp = request.responseText;
            var split = resp.split("\n");
            if ("Yes".localeCompare(split[0]) === 0) {
                window.location.href = split[1];
            } else {
                toastMessage(0, split[1], 3000);
            }
        }
    };
    request.setRequestHeader("Content-type", "application/json");
    request.send(data);
}

function checkboxUpdate(id) {
    var obj = document.getElementById(id);
    var selected = obj.getAttribute("selected");
    selected = (selected === "true") ? "false" : "true";
    var children = obj.childNodes;
    for (j = 0; j < children.length; j++) {
        var child = children[j];
        if ((child.nodeType == 1) && (child.tagName.toLowerCase() === "img")) {
            child.src = (selected === "true") ? "checkbox1.svg" : "checkbox0.svg";
            obj.setAttribute("selected", selected);
            break;
        }
    }
}

function radioButtonUpdate() {
    for (i = 0; i < arguments.length; i++) {
        var obj = document.getElementById(arguments[i]);
        var selected = (i == 0) ? "true" : "false";
        var children = obj.childNodes;
        for (j = 0; j < children.length; j++) {
            var child = children[j];
            if ((child.nodeType == 1) && (child.tagName.toLowerCase() === "img")) {
                child.src = (selected === "true") ? "radiobutton1.svg" : "radiobutton0.svg";
                obj.setAttribute("selected", selected);
                break;
            }
        }
    }
}

function showChangePasswordForm() {
    var form = document.getElementById("change-password-form");
    if (form == null) {
        var request = new XMLHttpRequest();
        request.open('GET', "/change-password-form", true);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.body.insertAdjacentHTML("afterbegin", request.responseText);
                form = document.getElementById("change-password-form");
                form.style.display = "block";

                var func = function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        changePassword();
                    } else if (event.keyCode === 27) {
                        event.preventDefault();
                        hideComponent("change-password-form")
                    }
                };
                document.getElementById("changePasswordCP").addEventListener("keydown", func);
                document.getElementById("changePasswordNP").addEventListener("keydown", func);
                document.getElementById("changePasswordRP").addEventListener("keydown", func);
            }
        };
        request.send();
    } else {
        document.getElementById("changePasswordCP").value = "";
        document.getElementById("changePasswordNP").value = "";
        document.getElementById("changePasswordRP").value = "";
        form.style.display = "block";
    }
}

function changePassword() {
    var cp = document.getElementById("changePasswordCP").value;
    var np = document.getElementById("changePasswordNP").value;
    var rp = document.getElementById("changePasswordRP").value;
    if (np === rp) {
        var hasCookie = (document.cookie.indexOf('username=') >= 0);
        var data = JSON.stringify({currentPassword: cp, newPassword: np, updateCookies: hasCookie});
        var request = new XMLHttpRequest();
        request.open('POST', "/change-password", true);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var resp = request.responseText;
                var split = resp.split("\n");
                if (split[0].localeCompare(request.responseText) === 0) {
                    toastMessage(2, "Пароль изменен успешно", 3000);
                    hideComponent("change-password-form");
                } else {
                    toastMessage(0, split[1], 3000);
                }
            }
        };
        request.setRequestHeader("Content-type", "application/json");
        request.send(data);
    } else {
        toastMessage(0, "Пароли не совпадают", 3000);
    }
}

function showComponent(comp) {
    var form = document.getElementById(comp);
    if (form != null) {
        form.style.display = "block";
        form.style.removeProperty("display");
    }
}

function hideComponent(comp) {
    var form = document.getElementById(comp);
    if (form != null) {
        form.style.display = "none";
    }
}

function download(fId) {
    document.getElementById('FileTransferIFrame').src = "/download?fileId=" + fId;
}

function uploadFileChanged(elem) {
    if ('files' in elem) {
        if (elem.files.length !== 0) {
            elem.nextElementSibling.innerText = elem.files[0].name;
            document.uploadForm.submit();
        }
    }
}

function toggleSidebarDisplay() {
    var sidebar = document.getElementById("SidebarContent");
    var dis = sidebar.style.display;
    sidebar.style.display = (dis === "none") ? "block" : "none";
}

function searchUsers() {
    var field = document.getElementById("SearchField");
    document.getElementById("ClearUserSearchFieldButton").style.display = (field.value === "") ? "none" : "inline-block";
    var list = document.getElementById("UsersList");
    var children = list.childNodes;
    for (i = 0; i < children.length; i++) {
        if (children[i].id === undefined) {
            console.log(children[i]);
            continue;
        }
        if (children[i].id.toLowerCase().includes(field.value.toLowerCase())) {
            children[i].style.removeProperty("display");
        } else {
            children[i].style.display = "none";
        }
    }
}

function getMyIpAddress() {
    var request = new XMLHttpRequest();
    request.open('GET', "/ipAddress", true);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var resp = request.responseText;
            toastMessage(2, "Ваш IP: " + resp, 3000);
        }
    };
    request.send();
}

function showMessagesInTimeRangeForm(username) {
    var form = document.getElementById("MessagesOfUserInTimeRangeForm");
    if (form == null) {
        var request = new XMLHttpRequest();
        request.open('GET', `/messages-date-range-form`, true);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.body.insertAdjacentHTML("afterbegin", request.responseText);
                form = document.getElementById("MessagesOfUserInTimeRangeForm");
                form.style.display = "block";

                document.getElementById("ShowMessagesInTimeRangeButton").setAttribute("onclick", "getMessagesInTimeRangeForm('" + username + "')");

                $(function() {
                    $('input[name="datetimes"]').daterangepicker({
                        timePicker: true,
                        timePicker24Hour: true,
                        opens: 'center',
                        singleDatePicker: false,
                        timePickerSeconds: true,
                        showDropdowns: true,
                        startDate: moment().startOf('hour').add(-24, 'hour') ,
                        endDate: moment().startOf('hour'),
                        locale: {
                            format: 'DD.MM.YYYY H:mm',
                            applyLabel: "Ок",
                            cancelLabel: "Отмена",
                            fromLabel: "С",
                            toLabel: "По",
                            "customRangeLabel": "Свой",
                            "daysOfWeek": [
                                "Вс",
                                "Пн",
                                "Вт",
                                "Ср",
                                "Чт",
                                "Пт",
                                "Сб"
                            ],
                            "monthNames": [
                                "Январь",
                                "Февраль",
                                "Март",
                                "Апрель",
                                "Май",
                                "Июнь",
                                "Июль",
                                "Август",
                                "Сентябрь",
                                "Октябрь",
                                "Ноябрь",
                                "Декабрь"
                            ],
                            "firstDay": 1
                        }
                    });

                    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
                        //console.log(picker.startDate.format('YYYY-MM-DD'));
                        //console.log(picker.endDate.format('YYYY-MM-DD'));
                    });
                });

                var func = function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                    } else if (event.keyCode === 27) {
                        event.preventDefault();
                        hideComponent("MessagesOfUserInTimeRangeForm")
                    }
                };
            }
        };
        request.send();
    } else {
        form.style.display = "block";
        document.getElementById("ShowMessagesInTimeRangeButton").setAttribute("onclick", "getMessagesInTimeRangeForm('" + username + "')");
    }
}

function getMessagesInTimeRangeForm(username) {
    let time_from = $('input[name="datetimes"]').data('daterangepicker').startDate._d.getTime();
    let time_to = $('input[name="datetimes"]').data('daterangepicker').endDate._d.getTime();
    var request = new XMLHttpRequest();
    request.open('GET', `/user/${username}/messages/from/${time_from}/to/${time_to}`, true);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            document.getElementById("ListMessagesInTimeRange").innerHTML = request.responseText;

            if (request.responseText === "") {
                document.getElementById("ListMessagesInTimeRange").innerHTML = "<p style='text-align: center'>Нет сообщений</p>"
            }
        }
    };
    request.send();
}