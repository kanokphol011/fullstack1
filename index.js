$(document).ready(function () {
    var chack = 0;
    //register
    $("#signup").click(function () {
        $.post("http://localhost:3000/regis", {
            email: $("#email").val(),
            name: $("#name").val(),
            username: $("#user").val(),
            password: $("#pass").val()
        });
        console.log($("#name").val() + " Complete");
    });
    //login
    $("#login").click(function () {
        $.getJSON("http://localhost:3000/regis", function (data) {
            for (i = 0; i < data.length; i++) {
                if (data[i].username == $("#name_login").val() && data[i].password == $("#pass_login").val()) {
                    localStorage.setItem("id", data[i].id);
                    window.location = "pageHome.html";
                    chack++;
                }
                if (i == data.length - 1 && chack == 0) {
                    alert("Username or Password your are wrong !!");
                }
            }
        });
    });
    //logout
    $("#logout").click(function () {
        localStorage.removeItem("id");
    });
    //map
    $("#location").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initMap);
        } else {
            $("#show_location").text("Geolocation is not supported by this browser.");
        }
    });

    function initMap(position) {
        var lat = position.coords.latitude;
        var log = position.coords.longitude;
        localStorage.setItem("lat", lat);
        localStorage.setItem("log", log);
        var uluru = { lat: lat, lng: log };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 17,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
    }
    //post
    $("#post").click(function () {
        var id_post = localStorage.getItem("id");
        var lat_post = localStorage.getItem("lat");
        var log_post = localStorage.getItem("log");
        var text_post = $("#comment").val();
        var img_post = localStorage.getItem("img");
        $.post("http://localhost:3000/posts", {
            post_id: id_post,
            image: img_post,
            text: text_post,
            log: log_post,
            lat: lat_post
        });
        localStorage.removeItem("lat");
        localStorage.removeItem("log");
        localStorage.removeItem("img");
        window.location = "pageHome.html";
    });

    //home
    $.getJSON("http://localhost:3000/posts", function (data) {
        for (i = 0; i < data.length; i++) {
            var id_post = data[i].post_id;
            var image = data[i].image;
            var comment = data[i].text;
            search_name(id_post, image, comment);
        }
    });
    function search_name(id_post, image, comment) {
        $.getJSON("http://localhost:3000/regis", function (data) {
            for (i = 0; i < data.length; i++) {
                if (id_post == data[i].id) {
                    $("#show_post").prepend("<tr id=\"name_bar\"><td><br><p><b>What happen : </b>" + comment + "</p><br></td></tr>");
                    $("#show_post").prepend("<tr><td id=\"remove_space\" align=\"center\"><img id=\"img_post_show\" src=" + image + "></td></tr>");
                    $("#show_post").prepend("<tr id=\"name_bar\"><td><br><p id=\"name_p\"><b>" + data[i].name + "</b></p></td></tr>");
                    $("#show_post").prepend("<tr><td id=\"space\"><br></td></tr>");
                }
            }
        });
    }
    //location_page
    $("#searchPin").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(location_page);
        } else {
            $("#map_page").text("Geolocation is not supported by this browser.");
        }
    });

    function location_page(position) {
        $("#map_page").addClass("map_page_");
        $("#searchPin").html(" ");
        var lat = position.coords.latitude;
        var log = position.coords.longitude;
        console.log(lat + " " + log);
        localStorage.setItem("lat", lat);
        localStorage.setItem("log", log);
        var uluru = { lat: lat, lng: log };
        var map = new google.maps.Map(document.getElementById('map_page'), {
            zoom: 16,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
        $.getJSON("http://localhost:3000/posts", function (data) {
            for (i = 0; i < data.length; i++) {
                var lat = data[i].lat;
                var log = data[i].log;
                console.log(lat + " " + log);
                var uluru = { lat: lat, lng: log };
                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
            }
        });
    }
    //setting
    $.getJSON("http://localhost:3000/regis", function (data) {
        for (i = 0; i < data.length; i++) {
            if (data[i].id == localStorage.getItem("id")) {
                $("#email_setting").attr("value", data[i].email);
                $("#name_setting").attr("value", data[i].name);
                $("#user_setting").attr("value", data[i].username);
                $("#password_setting").attr("value", data[i].password);
                var position = i;
                $("#done_btn").click(function () {
                    data[position].email = $("#email_setting").val();
                    data[position].name = $("#name_setting").val();
                    data[position].username = $("#user_setting").val();
                    data[position].password = $("#password_setting").val();
                    $.ajax({
                        url: "http://localhost:3000/regis/" + data[position].id,
                        type: "PUT",
                        data: data[position]
                    });
                    console.log(data[position]);
                    window.location = "setting.html";
                });
            }
        }
    });
    //delete
    $.getJSON("http://localhost:3000/posts", function (data) {
        var id = localStorage.getItem("id");
        for (i = 0; i < data.length; i++) {
            if (data[i].post_id == id) {
                var id2 = data[i].id;
                var image = data[i].image;
                var comment = data[i].text;
                $("#delete_post").prepend("<tr id=\"delete\"><td id=\"name_bar\"><br><p><b>What happen : </b>" + comment + "</p><br></td></tr>");
                $("#delete_post").prepend("<tr id=\"delete\"><td align=\"center\"><img id=\"img_post_delete\" src=" + image + "></td></tr>");
                $("#delete_post").prepend("<tr id=\"delete\"><td align=\"center\"><button type=\"button\" class=\"btn btn-danger\" onclick=\"deleter("+id2+")\">Delete</button></td></tr>");
                $("#delete_post").prepend("<tr id=\"delete\"><td id=\"space\"><br></td></tr>");
            }
        }
    });
});
//picture
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img')
                .attr('src', e.target.result)
                .width(400)
                .height(300);
            localStorage.setItem("img", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
//delete
function deleter(id){
    $.ajax({
        url: "http://localhost:3000/posts/"+id+"",
        type: "DELETE"
    });
    window.location = "setting.html";
};