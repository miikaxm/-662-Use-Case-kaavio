// Modal info
const loginModalEl = document.getElementById("LogInModal");
const registerModalEl = document.getElementById("registerModal");

const loginModal = new bootstrap.Modal(loginModalEl);
const registerModal = new bootstrap.Modal(registerModalEl);

const logInButton = document.getElementById("logInButton");
const navUsername = document.getElementById("navUsername");
const logOffItem = document.getElementById("dropdownLogOff");

// Log off nappi
document.getElementById("dropdownLogOff").addEventListener("click", logOff)

// Formien sumbit
document.getElementById('registerModal').addEventListener("submit", register)
document.getElementById("LogInModal").addEventListener("submit", logIn)

// Event listenerit äänestyksen luonti formille
// document.getElementById("createVotingBtn").addEventListener("click", showCreateVoting)
// document.getElementById("createVotingCloseBtn").addEventListener("click", hideCreateVoting)

// Kirjautumisen tilan tarkistus
document.getElementById("logInButton").addEventListener("click", checkLogState)

let loggedInAs = null

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function showCreateVoting() {
    document.getElementById("createVoting").classList.remove("invisible")
}

function hideCreateVoting() {
    document.getElementById("createVoting").classList.add("invisible")
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