window.onload = function () {

  var login = document.getElementsByClassName('btn-login')[0];
  var register = document.getElementsByClassName('btn-register')[0];
  var article = document.getElementsByClassName('post');

  for (var i=0; i < article.length; i++) {
    article[i].addEventListener('mouseover', function (event) {
       event.target.style.cursor = "pointer";
    });
    article[i].addEventListener('mousedown', function (event) {
      event.preventDefault();
    });
    article[i].addEventListener('mouseup', function (event) {
      var id = undefined;
      event.preventDefault();
      if (event.target.nodeName === "ARTICLE") {
        id = event.target.id;
        window.location.href = "/post/" + id;
      } else {
        id = event.target.parentNode.id;
        window.location.href = "/post/" + id;
      }
    });
  }

  if (login) {
    login.addEventListener('click', function (event) {
      window.location.href = "/login";
    });
  }
  if (register) {
    register.addEventListener('click', function (event) {
      window.location.href = "/register";
    });
  }

  if (window.location.pathname === '/login') {
    var forms = document.getElementsByTagName('form')[0]; //better to search by class name. FIXED THEM!!!

    var passwordDOM = document.getElementById('passwordLogin');
    var formGroupForPassword = passwordDOM.parentNode.parentNode;
    var usernameDOM = document.getElementById('usernameLogin');
    var formGroupForUsername = usernameDOM.parentNode.parentNode;

    var usernameVal = undefined;
    var passwordVal = undefined;
    var containerForRenderErrorUsername = undefined;
    var containerForRenderErrorPassword = undefined;

    forms.addEventListener('submit', function (event) {
      event.preventDefault();
      usernameVal = document.getElementById('usernameLogin').value;
      passwordVal = document.getElementById('passwordLogin').value;

      var dataForSendToServer = {
        username: usernameVal,
        password: passwordVal
      };

      $.ajax({
        url: '/login',
        method: 'POST',
        data: JSON.stringify(dataForSendToServer),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        statusCode: {
          200: function (data) {
            if (formGroupForPassword.classList.contains("has-error")) {
              formGroupForPassword.classList.remove("has-error");
              formGroupForPassword.classList.add("has-success");
              passwordDOM.nextSibling.nextSibling.innerHTML = "";
              containerForRenderErrorPassword.style.visibility = "hidden";
            }
            if (formGroupForUsername.classList.contains("has-error")) {
              formGroupForUsername.classList.remove("has-error");
              formGroupForUsername.classList.add("has-success");
              usernameDOM.nextSibling.nextSibling.innerHTML = "";
              containerForRenderErrorUsername.style.visibility = "hidden";
            }
            formGroupForUsername.classList.add("has-success");
            formGroupForPassword.classList.add("has-success");

            //handler modal window
            $('#myModalLogin').on('show.bs.modal', function() {
              var $modal = $(this);
              $modal.find('.modal-body > p').html("Authentication is successful! Welcome, dear " + data.username + "!");
            });
            $('#myModalLogin').modal('show');
            setTimeout(function () {
              $('#myModalLogin').modal('hide');
                window.location.href = "/";
            }, 2000);
          },
          403: function (jqXHR) {
          var error = JSON.parse(jqXHR.responseText);

            if (error.indexOf("password") != -1) {
              containerForRenderErrorPassword = document.getElementsByClassName('help-block-password')[0];
              if (formGroupForUsername.classList.contains("has-error")) {
                formGroupForUsername.classList.remove("has-error");
                usernameDOM.nextSibling.nextSibling.innerHTML = "";
                containerForRenderErrorUsername.style.visibility = "hidden";
              }
              if (!formGroupForPassword.classList.contains("has-error")) {
                formGroupForPassword.classList.add("has-error");
                var warningText = document.createTextNode("" + error);
                containerForRenderErrorPassword.appendChild(warningText);
                containerForRenderErrorPassword.style.visibility = "visible";
              } else {
                containerForRenderErrorPassword.style.visibility = "visible";
              }
              passwordDOM.addEventListener('focus', function () {
                if (formGroupForPassword.classList.contains("has-error")) {
                  containerForRenderErrorPassword.style.visibility = "hidden";
                }
              });
              passwordDOM.addEventListener('blur', function () {
                if (formGroupForPassword.classList.contains("has-error")) {
                  containerForRenderErrorPassword.style.visibility = "visible";
                }
              });

            } else if (error.indexOf("username") != -1) {
              if (formGroupForPassword.classList.contains("has-error")) {
                formGroupForPassword.classList.remove("has-error");
                passwordDOM.nextSibling.nextSibling.innerHTML = "";
                containerForRenderErrorPassword.style.visibility = "hidden";
              }
              containerForRenderErrorUsername = document.getElementsByClassName('help-block-username')[0];
              if (!formGroupForUsername.classList.contains("has-error")) {
                formGroupForUsername.classList.add("has-error");
                var warningText = document.createTextNode("" + error);
                containerForRenderErrorUsername.appendChild(warningText);
                containerForRenderErrorUsername.style.visibility = "visible";
              } else {
                containerForRenderErrorUsername.style.visibility = "visible";
              }
              usernameDOM.addEventListener('focus', function () {
                if (formGroupForUsername.classList.contains("has-error")) {
                  containerForRenderErrorUsername.style.visibility = "hidden";
                }
              });
              usernameDOM.addEventListener('blur', function () {
                if (formGroupForUsername.classList.contains("has-error")) {
                  containerForRenderErrorUsername.style.visibility = "visible";
                }
              });
            }
          }
        }
      });
    });
  } else if (window.location.pathname === '/register') {
    var forms = document.getElementsByTagName('form')[0]; //better to search by class name. FIXED THEM!!!
    forms.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = document.getElementById('emailRegister').value;
      var username = document.getElementById('usernameRegister').value;
      var password = document.getElementById('passwordRegister').value;
      var dataForSendToServer = {
        email: email,
        username: username,
        password: password
      };
      $.ajax({
        url: '/register',
        method: 'POST',
        data: JSON.stringify(dataForSendToServer),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        statusCode: {
          200: function (data) {
            //handler modal window
            $('#myModalRegister').on('show.bs.modal', function() {
              var $modal = $(this);
              $modal.find('.modal-body > p').html("You are registered. Welcome to my blog, dear " + data.username + "!");
            });
            $('#myModalRegister').modal('show');
            setTimeout(function () {
              $('#myModalRegister').modal('hide');
                window.location.href = "/";
            }, 2000);
          },
          403: function (jqXHR) {
            var error = JSON.parse(jqXHR.responseText);
            alert(error);
          }
        }
      });
    });
  }
}
