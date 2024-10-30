var currentTab = 0;
showTab(currentTab);

function showTab(n) {
    console.log("NeXT showTab");
    
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("back-btn").style.visibility = "hidden";
  } else {
    document.getElementById("back-btn").style.visibility = "visible";
  }

  if (n == 4) {
    document.getElementById("btn").style.display = "none";
  }

  fixStepIndicator(n)
}

function nextPrev(n) {

    const inputsValid = checkInputs();
    console.log("inputsValid ", inputsValid);
    
    
    if(inputsValid) {

        console.log("NeXT nextPrev", n);
    
      var x = document.getElementsByClassName("tab");
      console.log(x[currentTab]);
      
      if (n == 0) return false;
      x[currentTab].style.display = "none";
      currentTab = currentTab + n;
      if (currentTab >= x.length) {
        document.getElementById("form").submit();
        return false;
      }
      showTab(currentTab);
    } else return
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

function checkInputs(){ 
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    const regexUsername = new RegExp("^[a-zA-Z]");
    const regexEmail = /@/;

    const validUsername = regexUsername.test(username);
    const validEmail = regexEmail.test(email);
    const validPhone = phone.length === 10

    if(validUsername !== true) {
        if(username.length < 1) {
            document.getElementById("name-error").style.display = "block";
        } else {
            document.getElementById("name-error").innerHTML = "Invalid username";
            document.getElementById("name-error").style.display = "block";
        }
    } else {
        document.getElementById("name-error").style.display = "none";
    }

    if(validEmail !== true) {
        if(email.length < 1) {
            document.getElementById("email-error").style.display = "block";
        } else {
            document.getElementById("email-error").innerHTML = "Invalid email";
            document.getElementById("email-error").style.display = "block";
        }
    } else {
        document.getElementById("email-error").style.display = "none";
    }

    if(validPhone !== true) {
        if(phone.length < 1) {
            document.getElementById("phone-error").style.display = "block";
        } else {
            document.getElementById("phone-error").innerHTML = "Enter 10 digits phone number.";
            document.getElementById("phone-error").style.display = "block";
        }
    } else {
        document.getElementById("phone-error").style.display = "none";
    }

    console.log("validUsername ", validUsername);

    console.log("validEmail ", validEmail);
    
    const obj = {
        username: username,
        email: email,
        phone: phone,
    }
    
    console.log(obj);

    return validUsername && validEmail && validPhone;
}
