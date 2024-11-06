let currentTab = JSON.parse(localStorage.getItem('currentTab'));

let count = 1;

if(!currentTab) {
  currentTab = 0;
}

const userInfoDetails = JSON.parse(localStorage.getItem('userInfo'));
const addonsInfo = JSON.parse(localStorage.getItem('selectedAddons'));

let onlineAddons = addonsInfo['online-service'].selected;
let largeAddons = addonsInfo['large-storage'].selected;
let customAddons = addonsInfo['custom-storage'].selected;

let userInfo = {
  username: userInfoDetails ? userInfoDetails.username || '' : '',
  email: userInfoDetails ? userInfoDetails.email || '' : '',
  phone: userInfoDetails ? userInfoDetails.phone || '' : '',
  status: userInfoDetails ? userInfoDetails.status || false : false,
}

let defaultUserInfo = {
  username: '',
  email: '',
  phone: '',
  status: false,
}

document.getElementById('checkbox').checked = userInfo.status;

document.getElementById('addon-online-service').checked = onlineAddons;
document.getElementById('addon-large-profile').checked = largeAddons;
document.getElementById('addon-custom-profile').checked = customAddons;

document.getElementById('user-info').addEventListener('change', function(e) {
  e.preventDefault();
  userInfo.username = document.getElementById("username").value;
  userInfo.email = document.getElementById("email").value;
  userInfo.phone = document.getElementById("phone").value;

  localStorage.setItem('userInfo', JSON.stringify(userInfo));
})

function cardPrice() {
  const cardInfo = JSON.parse(localStorage.getItem('selectedCard'));
  let planPrice = parseFloat(cardInfo.price.replace(/[^0-9.]/g, ''));
  
  document.getElementById('arcade-price-title').innerText = userInfo.status ? `+$${planPrice}/yr` : `+$${planPrice}/mo`;
}

function getUserInfo() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  const name = userInfo ? userInfo.username || '' : '';
  const email = userInfo ? userInfo.email || '' : '';
  const phone = userInfo ? userInfo.phone || '' : '';
  
  document.getElementById('username').value = name;
  document.getElementById('email').value = email;
  document.getElementById('phone').value = phone;
}

showTab(currentTab);

function showTab(n) {
  updateServices();

  // handle card states
  if(n === 1) {
    toggleBilling();
  }
  
  const selectedCard = JSON.parse(localStorage.getItem('selectedCard'));
  
  if(!selectedCard) {
    document.getElementById("card-1").classList.add("card-1");
    document.getElementById("card-2").classList.add("card-1");
    document.getElementById("card-3").classList.add("card-1");
  } else {
    document.getElementById(selectedCard.id).classList.add("card-clicked");
  }
  getUserInfo()
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
    const selectedCard = JSON.parse(localStorage.getItem('selectedCard'));
    
    if (n === 1 && selectedCard === null) {
      alert('Please select a card to proceed to the next step.');
      return;
    }

    if(inputsValid) {
      var x = document.getElementsByClassName("tab");
      if (n == 0) return false;
      x[currentTab].style.display = "none";
      currentTab = currentTab + n;     
      localStorage.setItem('currentTab', JSON.stringify(currentTab));
      
      document.getElementById('next-btn').classList.remove('confirm-btn');
      document.getElementById('next-btn').textContent = "Next Step"
      if(currentTab === 3) {
        document.getElementById('next-btn').textContent = "Confirm"
        document.getElementById('next-btn').classList.add('confirm-btn');
      }
      if(currentTab === 4) {
        clearLocalStorage();
        localStorage.setItem('currentTab', JSON.stringify(0));
        localStorage.setItem('userInfo', JSON.stringify(defaultUserInfo));
      }
      for (let i = 1; i <= 4; i++) {
          const tab = document.getElementById(`num-${i}`);
          if (i - 1 === currentTab) {
              tab.style.backgroundColor = "hsl(206, 94%, 87%)";
              tab.style.color = "hsl(213, 96%, 18%)";
          } else {
              tab.style.backgroundColor = "#483EFF";
              tab.style.color = "white";
          }
      }
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
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPhone = /^(?:\+91\s?\d{10}|\+91\d{10}|\d{10})$/;

    const validUsername = regexUsername.test(username);
    const validEmail = regexEmail.test(email);
    const validPhone = regexPhone.test(phone);

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
            document.getElementById("phone-error").innerHTML = "Enter 10 digits phone number";
            document.getElementById("phone-error").style.display = "block";
        }
    } else {
        document.getElementById("phone-error").style.display = "none";
    }
    return validUsername && validEmail && validPhone;
}

function toggleBilling() {
  clearLocalStorage()
  deselectAllAddons()
  const offers = document.querySelectorAll('.card-info-y');
  const isChecked = document.querySelector('input[type="checkbox"]').checked;
    
  userInfo.status = isChecked;

  localStorage.setItem('userInfo', JSON.stringify(userInfo));

  if(userInfo.status) {
    document.getElementById('checkbox').checked = userInfo.status;
  }

  const monthlyPrices = [
    { price: 9, period: "mo" },
    { price: 12, period: "mo" },
    { price: 15, period: "mo" }
  ];

  const yearlyPrices = [
      { price: 90, period: "yr" },
      { price: 120, period: "yr" },
      { price: 150, period: "yr" }
  ];
  
  const selectedPrices = isChecked ? yearlyPrices : monthlyPrices;

  updatePrices(selectedPrices, isChecked);

      offers.forEach(offer => {
          offer.style.display = isChecked ? 'block' : 'none';
  });

  const cards = document.querySelectorAll('.card-1');

  cards.forEach(card => {
    card.classList.remove('card-clicked');
});

const card1 = document.getElementById("card-1");
  if (card1) {
    card1.classList.add('card-clicked');
  }

const cardInfo = {
  id: card1.id,
  title: card1.querySelector('.card-info-title').textContent,
  price: card1.querySelector('.card-info-m').textContent,
};
  localStorage.setItem('selectedCard', JSON.stringify(cardInfo));
}

function updatePrices(prices, isYearly) {
    prices.forEach((priceInfo, index) => {
        document.getElementById(`card-info-m-${index + 1}`).innerHTML = `$${priceInfo.price}/${priceInfo.period}`;
    });
    const addonPrices = isYearly ? [10, 20, 20] : [1, 2, 2];
    addonPrices.forEach((price, index) => {
        const period = isYearly ? "yr" : "mo";
        document.getElementById(`addons-price-${index + 1}`).innerHTML = `+$${price}/${period}`;
    });

    const tabTitle = isYearly ? "Arcade (Yearly)" : "Arcade (Monthly)";
    const totalTitle = isYearly ? "Total (per year)" : "Total (Monthly)";
    document.getElementById('change-tab-title').innerHTML = tabTitle;
    document.getElementById('service-title').innerHTML = totalTitle;
}

function clearCheckbox() {
  const onlineServiceCheckbox = document.getElementById('addon-online-service');
  const largeServiceCheckbox = document.getElementById('addon-large-profile');
  const customServiceCheckbox = document.getElementById('addon-custom-profile');

  onlineServiceCheckbox.checked = false;
  largeServiceCheckbox.checked = false;
  customServiceCheckbox.checked = false;
}

function clearLocalStorage() {
  localStorage.setItem('selectedAddons', JSON.stringify(
    {"online-service":{"selected":false,"price":"+$1/mo"},"large-storage":{"selected":false,"price":"+$2/mo"},"custom-storage":{"selected":false,"price":"+$2/mo"}}
  ));
}

function deselectAllAddons() {
  const checkboxes = document.querySelectorAll('.addons-checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    const addonContainer = checkbox.closest('.online-services');
    if(addonContainer) {
      addonContainer.classList.remove('selected');
    }
  });
  const deselectedAddons = {
    "online-service": { selected: false, price: "+$1/mo" },
    "large-storage": { selected: false, price: "+$2/mo" },
    "custom-storage": { selected: false, price: "+$2/mo" }
  };
  localStorage.setItem('selectedAddons', JSON.stringify(deselectedAddons));
}

function selectCard(e) {
  clearCheckbox();

  const cards = document.querySelectorAll('.card-1');
    cards.forEach(card => {
        card.classList.remove('card-clicked');
    });

    const clickedCard = e.currentTarget;    
    clickedCard.classList.add('card-clicked');

    const cardInfo = {
      id: clickedCard.id,
      title: clickedCard.querySelector('.card-info-title').textContent,
      price: clickedCard.querySelector('.card-info-m').textContent,
  };

  localStorage.setItem('selectedCard', JSON.stringify(cardInfo));

  updateServices();
}

function updateAddons(event) {
  
  const addon = event.target;
  const addonValue = addon.value;
  const addonPriceElement = addon.closest('.online-services').querySelector('.addons-amount p'); 
  const addonPrice = addonPriceElement ? addonPriceElement.textContent : ''; 

  const addons = JSON.parse(localStorage.getItem('selectedAddons')) || {};
  
  const onlineServicesDiv = addon.closest('.online-services');

  if (addon.checked) {
      onlineServicesDiv.classList.add('selected');
      addons[addonValue] = {
          selected: true,
          price: addonPrice
      };
  } else {
    onlineServicesDiv.classList.remove('selected');
    addons[addonValue] = {
      selected: false,
      price: 0,
    };
  }
  
  localStorage.setItem('selectedAddons', JSON.stringify(addons));
  updateServices();
}

function updateServices() {
  cardPrice()
  const planInfo = JSON.parse(localStorage.getItem('selectedCard'));
  let finalTotal = parseFloat(planInfo.price.replace(/[^0-9.]/g, ''));

  const selectedAddons = JSON.parse(localStorage.getItem('selectedAddons'));

  let price_1 = 0;
  let price_2 = 0;
  let price_3 = 0;

  document.getElementById('online-service').style.display = 'none';
  document.getElementById('large-service').style.display = 'none';
  document.getElementById('custom-service').style.display = 'none';
  
  if (selectedAddons['online-service'] && selectedAddons['online-service'].selected) {
      document.getElementById('online-service').style.display = 'flex';
      document.getElementById('service-price-1').innerText = selectedAddons['online-service'].price;
      document.getElementById('service-title-1').innerText = "Online Service";
      price_1 = selectedAddons['online-service'].price
      price_1 = parseFloat(price_1.replace(/[^0-9.]/g, ''));
  }
  if (selectedAddons['large-storage'] && selectedAddons['large-storage'].selected) {
      document.getElementById('large-service').style.display = 'flex';
      document.getElementById('service-price-2').innerText = selectedAddons['large-storage'].price;
      document.getElementById('service-title-2').innerText = "Large Storage";
      price_2 = selectedAddons['large-storage'].price
      price_2 = parseFloat(price_2.replace(/[^0-9.]/g, ''));
  }
  if (selectedAddons['custom-storage'] && selectedAddons['custom-storage'].selected) {
      document.getElementById('custom-service').style.display = 'flex';
      document.getElementById('service-price-3').innerText = selectedAddons['custom-storage'].price;
      document.getElementById('service-title-3').innerText = "Custom Storage";
      price_3 = selectedAddons['custom-storage'].price
      price_3 = parseFloat(price_3.replace(/[^0-9.]/g, ''));
  }

  finalTotal += price_1 + price_2 + price_3;
  
  document.getElementById('total-price').innerText = userInfo.status ? `+$${finalTotal}/yr` : `+$${finalTotal}/mo`;
}