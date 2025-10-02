// Event listenerit rekisteröitymis formille
document.getElementById("registerBtn").addEventListener("click", showRegisterForm)
document.getElementById("RegisterFormCloseBtn").addEventListener("click", hideRegisterForm)

document.getElementById("dropdownLogOff").addEventListener("click", logOff)

document.getElementById('RegisterForm').addEventListener("submit", register)
document.getElementById("logInForm").addEventListener("submit", logIn)


// Event listenerit kirjautumis formille
document.getElementById("logInButton").addEventListener("click", showLogIn)
document.getElementById("logInFormCloseBtn").addEventListener("click", hideLogIn)


// Formien kehotukset
document.getElementById("registerFromLogin").addEventListener("click", forceRegisterForm)
document.getElementById("logInFromRegisteration").addEventListener("click", forceLogInForm)

let logInFormVisible = false
let registerFormVisible = false
let loggedInAs = null

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function forceRegisterForm() {
    hideLogIn()
    showRegisterForm()
}

function forceLogInForm() {
    hideRegisterForm()
    showLogIn()
}

function showLogIn() {
    if (loggedInAs === null) {
        if (registerFormVisible === false) {
        logInFormVisible = true
        document.getElementById("logInForm").classList.remove("invisible")
        } 
    } else {
        logOff()
    }
}

function hideLogIn() {
    logInFormVisible = false
    document.getElementById("logInForm").classList.add("invisible")
}

function showRegisterForm(){
    if (logInFormVisible === false) {
        registerFormVisible = true
        document.getElementById("RegisterForm").classList.remove("invisible")
    }
}

function hideRegisterForm(){
    registerFormVisible = false
    document.getElementById("RegisterForm").classList.add("invisible")
}

function register(){
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value
    const moderator = document.getElementById("checkDefault").checked
    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert("Käyttäjätunnus on jo olemassa")
        return
    }

    const newUser = {
        username,
        password,
        moderator
    }

    users.push(newUser)
    saveUsers(users)
    hideRegisterForm()
}

function logIn(){
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value
    const users = getUsers()

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if(!user) {
        alert("Käyttäjää tällä nimellä ei löydy")
        return
    }

    if (user.password === password) {
        alert("kirjautuminen onnistui")
        loggedInAs = username
        document.getElementById("navUsername").innerHTML = username
        document.getElementById("logInButton").innerHTML = "Kirjaudu ulos"
        if (user.moderator === true) {
            document.getElementById("createPollBtn").classList.remove("invisible")
        }
        hideLogIn()
    } else {
        alert("Väärä salasana")
    }
}

function logOff() {
    if (loggedInAs !== null){
        loggedInAs = null
        document.getElementById("navUsername").innerHTML = ""
        document.getElementById("logInButton").innerHTML = "Kirjaudu sisään"
        document.getElementById("createPollBtn").classList.add("invisible")
    } else {
        alert("Et ole kirjautunut sisään!")
    }
}