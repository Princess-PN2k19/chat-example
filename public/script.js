var usersList = [];
var myName = "";
imTyping = false;
var socket = io();
socket.on("connect", function (e) {
    socket.emit("start");
});
socket.on('name', function (name) {
    myName = name;
});
$('form').submit(function () {
    var temp = [myname, $("#boxMessage").val()];
    socket.emit("send chat message", temp);
    $("#boxMessage").val("");
    imTyping = false;
    socket.emit("not typing");
    return false;
});
socket.on('chat message', function (msg) {
    $("#messages").append("<li><b>" + msg[0] + ":</b> " + msg[1]);
});
socket.on('info', function (inf) {
    $('#messages').append('<li><i>' + inf + '</i></li>');
});
socket.on('users list', function (usersList) {
    updateUserList(usersList);
});
socket.on('typing signal', function (usersList) {
    updateUserList(usersList);
});
function setMyName() {
    myName = document.getElementById("boxName").value;
    socket.emit("set name", myName);
    document.getElementById("boxName").disabled = true;
    document.getElementById("buttonName").hidden = true;
    document.getElementById("boxMessage").disabled = false;
    document.getElementById("buttonMessage").disabled = false;
}
function updateUserList(u) {
    var list = document.getElementById("ulist");
    list.innerHTML = "";
    for (var i = 0; i < u.length; i++) {
        var item = document.createElement("li");
        item.innerHTML = u[i];
        list.appendChild(item);
    }
}
$('#boxMessage').on('input', function () {
    if ($('#boxMessage').val().length != "" && imTyping == false) {
        socket.emit("typing");
        imTyping = true;
    }
    else if ($('#boxMessage').val() == "") {
        socket.emit("not typing");
        imTyping = false;
    }
});
