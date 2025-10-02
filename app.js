// Event listenerit rekisteröitymis formille
document.getElementById("registerBtn").addEventListener("click", showRegisterForm)
document.getElementById("RegisterFormCloseBtn").addEventListener("click", hideRegisterForm)


// Event listenerit kirjautumis formille
document.getElementById("logInButton").addEventListener("click", showLogIn)
document.getElementById("logInFormCloseBtn").addEventListener("click", hideLogIn)

function showLogIn() {
    document.getElementById("logInForm").classList.remove("invisible")
}

function hideLogIn() {
    document.getElementById("logInForm").classList.add("invisible")
}

function showRegisterForm(){
    document.getElementById("RegisterForm").classList.remove("invisible")
}

function hideRegisterForm(){
    document.getElementById("RegisterForm").classList.add("invisible")
}