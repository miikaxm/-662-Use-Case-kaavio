// Modal info
const loginModalEl = document.getElementById("LogInModal");
const registerModalEl = document.getElementById("registerModal");

const loginModal = new bootstrap.Modal(loginModalEl);
const registerModal = new bootstrap.Modal(registerModalEl);

// Log off nappi
document.getElementById("dropdownLogOff").addEventListener("click", logOff)

// Formien sumbit
document.getElementById('registerModal').addEventListener("submit", register)
document.getElementById("LogInModal").addEventListener("submit", logIn)

// Event listenerit äänestyksen luonti formille
document.getElementById("createVotingBtn").addEventListener("click", showCreateVoting)
document.getElementById("createVotingCloseBtn").addEventListener("click", hideCreateVoting)

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
        logOff()
        return
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
        document.getElementById("dropdownLogOff").classList.remove("disabled")
        document.getElementById("navUsername").innerHTML = username
        document.getElementById("logInButton").innerHTML = "Kirjaudu ulos"
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
        loggedInAs = null
        document.getElementById("dropdownLogOff").classList.add("disabled")
        document.getElementById("navUsername").innerHTML = ""
        document.getElementById("logInButton").innerHTML = "Kirjaudu sisään"
        document.getElementById("createPollBtn").classList.add("invisible")
    } else {
        alert("Et ole kirjautunut sisään!")
    }
}