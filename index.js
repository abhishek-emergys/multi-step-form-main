var currentTab = 0;
showTab(currentTab);

function showTab(n) {    
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
    if(inputsValid) {
      var x = document.getElementsByClassName("tab");
      if (n == 0) return false;
      x[currentTab].style.display = "none";
      currentTab = currentTab + n;      
      if(currentTab == 4) {
        clearLocalStorage();
      }

      for (let i = 1; i <= 4; i++) {
          const tab = document.getElementById(`num-${i}`);

          if (i - 1 === currentTab) {
              tab.style.backgroundColor = "hsl(206, 94%, 87%)";
          } else {
              tab.style.backgroundColor = "#483EFF";
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

    return validUsername && validEmail && validPhone;
}

function toggleBilling() {
  const offers = document.querySelectorAll('.card-info-y');
  const isChecked = document.querySelector('input[type="checkbox"]').checked;

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
    const totalTitle = isYearly ? "Total (per year)" : "Total (per year)";
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
  localStorage.setItem('selectedAddons', JSON.stringify({}));
}

function selectCard(e) {
  
  clearLocalStorage();
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

  const planInfo = JSON.parse(localStorage.getItem('selectedCard'));

  document.getElementById('arcade-price-title').innerHTML = planInfo.price
}

function updateAddons(event) {
  
  const addon = event.target;
  const addonValue = addon.value;
  const addonPriceElement = addon.closest('.online-services').querySelector('.addons-amount p'); 
  const addonPrice = addonPriceElement ? addonPriceElement.textContent : ''; 
  
  const addons = JSON.parse(localStorage.getItem('selectedAddons')) || {};

  if (addon.checked) {
      addons[addonValue] = {
          selected: true,
          price: addonPrice
      };
  } else {
    delete addons[addonValue];
  }
  localStorage.setItem('selectedAddons', JSON.stringify(addons));
  updateServices()
}

function updateServices() {
  const isChecked = document.querySelector('input[type="checkbox"]').checked;
  
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
      price_1 = selectedAddons['online-service'].price
      price_1 = parseFloat(price_1.replace(/[^0-9.]/g, ''));
  }
  if (selectedAddons['large-storage'] && selectedAddons['large-storage'].selected) {
      document.getElementById('large-service').style.display = 'flex';
      document.getElementById('service-price-2').innerText = selectedAddons['large-storage'].price;
      price_2 = selectedAddons['large-storage'].price
      price_2 = parseFloat(price_2.replace(/[^0-9.]/g, ''));
  }
  if (selectedAddons['custom-storage'] && selectedAddons['custom-storage'].selected) {
      document.getElementById('custom-service').style.display = 'flex';
      document.getElementById('service-price-3').innerText = selectedAddons['custom-storage'].price;
      price_3 = selectedAddons['custom-storage'].price
      price_3 = parseFloat(price_3.replace(/[^0-9.]/g, ''));
  }

  finalTotal += price_1 + price_2 + price_3;
  document.getElementById('total-price').innerText = isChecked ? `+$${finalTotal}/yr` : `+$${finalTotal}/mo`;
}
