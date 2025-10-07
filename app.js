// Modal info
const loginModalEl = document.getElementById("LogInModal");
const registerModalEl = document.getElementById("registerModal");

const loginModal = new bootstrap.Modal(loginModalEl);
const registerModal = new bootstrap.Modal(registerModalEl);

const logInButton = document.getElementById("logInButton");
const navUsername = document.getElementById("navUsername");
const logOffItem = document.getElementById("dropdownLogOff");

// Äänestyksen tiedot
const form = document.getElementById("createVotingModal");
const addOptionBtn = document.getElementById("addOptionBtn");
const optionsContainer = document.getElementById("pollOptionsContainer");
const pollsContainer = document.querySelector(".container.text-center .row");

// Log off nappi
document.getElementById("dropdownLogOff").addEventListener("click", logOff)

// Formien sumbit
document.getElementById('registerModal').addEventListener("submit", register)
document.getElementById("LogInModal").addEventListener("submit", logIn)

// Kirjautumisen tilan tarkistus
document.getElementById("logInButton").addEventListener("click", checkLogState)

let loggedInAs = null

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function checkLogState() {
    if (loggedInAs !== null) {
        loggedInAs = null
        updateLogInState()
        console.log("Käyttäjä kirjautui ulos");
    }
}

function updateLogInState() {
    if (loggedInAs !== null){
        logInButton.textContent = "Kirjaudu ulos"
        logInButton.removeAttribute("data-bs-toggle")
        logInButton.removeAttribute("data-bs-target")
        logOffItem.classList.remove("disabled");
        navUsername.textContent = loggedInAs;
    } else {
        logInButton.textContent = "Kirjaudu sisään";
        logInButton.setAttribute("data-bs-toggle", "modal");
        logInButton.setAttribute("data-bs-target", "#LogInModal");
        document.getElementById("createPollBtn").classList.add("invisible")
        logOffItem.classList.add("disabled");
        navUsername.textContent = "";
    }
}

function register(event){
    event.preventDefault()
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value
    const moderator = document.getElementById("checkDefault").checked
    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        document.getElementById("usernameTakenWarning").innerHTML = "Käyttäjätunnus on jo olemassa"
        return
    }

    const newUser = {
        username,
        password,
        moderator
    }

    users.push(newUser)
    saveUsers(users)
    registerModal.hide()
}

function logIn(event){
    event.preventDefault()
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value
    const users = getUsers()

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if(!user) {
        document.getElementById("usernameInvalid").innerHTML = "Käyttäjää tällä nimellä ei löydy"
    } else {
        document.getElementById("usernameInvalid").innerHTML = ""
    }

    if (user.password === password) {
        loggedInAs = username
        updateLogInState()
        loginModal.hide()
        if (user.moderator === true) {
            document.getElementById("createPollBtn").classList.remove("invisible")
        }
    } else {
        document.getElementById("wrongPassword").innerHTML = "Väärä salasana"
    } 
}

function logOff() {
    if (loggedInAs !== null){
        checkLogState()
    } else {
        alert("Et ole kirjautunut sisään!")
    }
}

addOptionBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control mb-2 pollOption";
  input.placeholder = `Vaihtoehto ${optionsContainer.querySelectorAll(".pollOption").length + 1}`;
  optionsContainer.appendChild(input);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("pollTitle").value.trim();
  const description = document.getElementById("pollDescription").value.trim();
  const options = Array.from(document.querySelectorAll(".pollOption"))
    .map(opt => opt.value.trim())
    .filter(v => v !== "");
  if (options.length < 2) {
    alert("Lisää vähintään kaksi vaihtoehtoa!");
    return;
  }

  // Luodaan äänestys kenttä
  const pollHTML = `
    <div class="col p-0 text-white" style="border: 2px solid rgb(70,70,70); border-radius: 5px;">
      <h4 class="pt-2">${title}</h4>
      <p class="mx-2 pt-2 pb-3" style="border-bottom: 2px solid rgb(70,70,70);">${description}</p>
      ${options.map((opt, i) => `
        <div class="m-2 form-check my-2">
          <input class="form-check-input" type="radio" name="poll_${title}" id="${title}_opt${i}">
          <label class="form-check-label p-1 custom-radio-label" for="${title}_opt${i}">
            ${opt}
          </label>
        </div>
      `).join("")}
      <div class="p-3 mt-4" style="background-color: rgb(54,54,54); border-top: 2px solid rgb(70,70,70);">
        <a style="display:inline; padding-right:200px; text-decoration:none;" class="text-white" href="#">Katso tulokset</a>
        <button type="button" class="btn border" style="display:inline;">Äänestä</button>
      </div>
    </div>
  `;
  pollsContainer.insertAdjacentHTML("beforeend", pollHTML);
  const modalEl = document.getElementById("createVotingModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  form.reset();
  optionsContainer.innerHTML = `
    <label class="form-label">Vaihtoehdot</label>
    <input type="text" class="form-control mb-2 pollOption" placeholder="Vaihtoehto 1" required>
    <input type="text" class="form-control mb-2 pollOption" placeholder="Vaihtoehto 2" required>
  `;
});


