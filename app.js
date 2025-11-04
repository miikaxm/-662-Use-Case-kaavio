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

// Äänestysten määrä
let pollAmount = 0

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getPolls() {
  return JSON.parse(localStorage.getItem("polls") || "[]");
}

function savePolls(polls) {
  localStorage.setItem("polls", JSON.stringify(polls))
}

function checkLogState() {
    if (loggedInAs !== null) {
        loggedInAs = null
        updateLogInState()
        checkIfCanVote()
        console.log("Käyttäjä kirjautui ulos");
        window.location.reload()
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

// Rekisteröinti
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

// Kirjautuminen
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
        checkIfCanVote()
        updatePollVoted()
        loginModal.hide()
        if (user.moderator === true) {
            document.getElementById("createPollBtn").classList.remove("invisible")
        }
    } else {
        document.getElementById("wrongPassword").innerHTML = "Väärä salasana"
    } 
}

// Ulos kirjautuminen
function logOff() {
    if (loggedInAs !== null){
        checkLogState()
    } else {
        alert("Et ole kirjautunut sisään!")
    }
}

// Äänestyksen luonti
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
  const polls = getPolls()
  const options = Array.from(document.querySelectorAll(".pollOption"))
    .map(opt => {
      const name = opt.value.trim();
      if (name === "") return null;
      return { name, votes: 0 };
    })
    .filter(v => v !== null);
  const newPoll = {
    title,
    description,
    options
  }
  polls.push(newPoll)
  savePolls(polls)
  pollAmount += 1;
  if (options.length < 2) {
    alert("Lisää vähintään kaksi vaihtoehtoa!");
    return;
  }

  // Luodaan äänestys kenttä
  const pollHTML = `
      <div class="col-12 col-sm-6 col-md-4 mb-3 text-white" id="forRemove_${title}">
        <div class="" style="border: 2px solid rgb(70,70,70); border-radius: 5px;">
          <h4 id="pollcontainer_${title} class="pt-2">${title}</h4>
          <p class="mx-2 pt-2 pb-3" style="border-bottom: 2px solid rgb(70,70,70);">${description}</p>
          ${options.map((opt, i) => `
            <div class="m-2 form-check my-2">
              <input class="form-check-input" type="radio" name="poll_${title}" id="${title}_opt${i}">
              <label class="form-check-label p-1 w-100 custom-radio-label" for="${title}_opt${i}">
                ${opt.name}
              </label>
            </div>
          `).join("")}
          <div id="containerBtns${title}" class="p-3 mt-4" style="background-color: rgb(54,54,54); border-top: 2px solid rgb(70,70,70);">
            <a style="display:inline; padding-right:50px; text-decoration:none;" class="text-white" href="#" id="checkVotesBtn${title}">Katso tulokset</a>
            <button type="button" class="btn border" style="display:inline;" id="voteBtn${title}">Äänestä</button>
          </div>
        </div>
      </div>
    `;
  pollsContainer.insertAdjacentHTML("beforeend", pollHTML);
  const modalEl = document.getElementById("createVotingModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  optionsContainer.innerHTML = `
    <label class="form-label">Vaihtoehdot</label>
    <input type="text" class="form-control mb-2 pollOption" placeholder="Vaihtoehto 1" required>
    <input type="text" class="form-control mb-2 pollOption" placeholder="Vaihtoehto 2" required>
  `;
});


// Käy läpi kaikki äänestykset localstoragesta sivun latautuessa ja päivittää ne sivulle näkyviin
document.addEventListener("DOMContentLoaded", function() {
  checkPollState()
  checkIfCanVote()
})

// Äänestysten uudelleen lataus sivun latautuessa
function checkPollState() {
  const polls = getPolls()
  polls.forEach(poll => {
    const pollHTML = `
      <div class="col-12 col-sm-6 col-md-4 mb-3 text-white" id="forRemove_${poll.title}">
        <div class="" style="border: 2px solid rgb(70,70,70); border-radius: 5px;">
          <h4 id="pollcontainer_${poll.title}" class="pt-2">${poll.title}</h4>
          <p class="mx-2 pt-2 pb-3" style="border-bottom: 2px solid rgb(70,70,70);">${poll.description}</p>
          ${poll.options.map((opt, i) => `
            <div class="m-2 form-check my-2">
              <input class="form-check-input" type="radio" name="poll_${poll.title}" id="${poll.title}_opt${i}">
              <label class="form-check-label p-1 w-100 custom-radio-label" for="${poll.title}_opt${i}">
                ${opt.name}
              </label>
            </div>
          `).join("")}
          <div id="containerBtns${poll.title}" class="p-3 mt-4" style="background-color: rgb(54,54,54); border-top: 2px solid rgb(70,70,70);">
            <a style="display:inline; padding-right:50px; text-decoration:none;" class="text-white" href="#" id="checkVotesBtn${poll.title}">Katso tulokset</a>
            <button type="button" class="btn border" style="display:inline;" id="voteBtn${poll.title}">Äänestä</button>
          </div>
        </div>
      </div>
    `;
  pollsContainer.insertAdjacentHTML("beforeend", pollHTML);
  });
}

function checkIfCanVote() {
  const username = document.getElementById("loginUsername").value.trim();
  const users = getUsers()
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (loggedInAs === null) {
    const polls = getPolls()
    polls.forEach(poll => {
      const btnCheckVotes = document.getElementById(`checkVotesBtn${poll.title}`)
      const btnVote = document.getElementById(`voteBtn${poll.title}`)
      if (btnCheckVotes) btnCheckVotes.remove()
      if (btnVote) btnVote.remove()
      const noVoteMessage = document.createElement("p");
      noVoteMessage.textContent = "Kirjaudu sisään äänestääksesi";
      noVoteMessage.className = "pt-2";
      noVoteMessage.id = `noVoteMessage${poll.title}`
      const containerBtns = document.getElementById(`containerBtns${poll.title}`);
      if (containerBtns) containerBtns.appendChild(noVoteMessage);

      // Poistaa "Olet jo äänestänyt tekstin"
      const lockedMsg = document.getElementById(`lockedMsg${poll.title}`);
      if (lockedMsg) lockedMsg.remove();
    })
  } else if (loggedInAs&&user.moderator === true) {
    const polls = getPolls()
        polls.forEach(poll => {
          const btnCheckVotes =`<a style="display:inline; padding-right:50px; text-decoration:none;" class="text-white" href="#" id="checkVotesBtn${poll.title}">Katso tulokset</a>`
          const btnVote = `<button type="button" class="btn border" style="display:inline;" id="voteBtn${poll.title}">Äänestä</button>`
          const deleteBtn = `<button type="button" class="btn-close" style="display:inline; padding-left:20px" id="deleteBtn${poll.title}" aria-label="Close"></button>`
          const noVoteMessage = document.getElementById(`noVoteMessage${poll.title}`)
          if (noVoteMessage) noVoteMessage.remove()
          const containerBtns = document.getElementById(`containerBtns${poll.title}`);
          const wholeContainer = document.getElementById(`pollcontainer_${poll.title}`)
          if (containerBtns) {
              containerBtns.insertAdjacentHTML('beforeend', btnCheckVotes);
              containerBtns.insertAdjacentHTML('beforeend', btnVote);
          if (wholeContainer) {
            wholeContainer.insertAdjacentHTML("beforeend", deleteBtn)
          }
      }
    })
      } else if (loggedInAs) {
        const polls = getPolls()
        polls.forEach(poll => {
          const btnCheckVotes =`<a style="display:inline; padding-right:50px; text-decoration:none;" class="text-white" href="#" id="checkVotesBtn${poll.title}">Katso tulokset</a>`
          const btnVote = `<button type="button" class="btn border" style="display:inline;" id="voteBtn${poll.title}">Äänestä</button>`
          const noVoteMessage = document.getElementById(`noVoteMessage${poll.title}`)
          if (noVoteMessage) noVoteMessage.remove()
          const containerBtns = document.getElementById(`containerBtns${poll.title}`);
          if (containerBtns) {
              containerBtns.insertAdjacentHTML('beforeend', btnCheckVotes);
              containerBtns.insertAdjacentHTML('beforeend', btnVote);
      }
    })
  }
}

// Event listeneri äänestyksille
document.addEventListener('click', function(event) {
  if (event.target.id.startsWith('voteBtn')) {
    const pollTitle = event.target.id.replace('voteBtn', '');
    const selectedOption = document.querySelector(`input[name="poll_${pollTitle}"]:checked`);
    
    // Jos vaihtoehtoa ei ole valittu ilmoittaa siitä
    if (!selectedOption) {
      const existing = document.getElementById(`voteWarning${pollTitle}`);
      if (existing) existing.remove();

      const warning = document.createElement('p');
      warning.id = `voteWarning${pollTitle}`;
      warning.textContent = 'Valitse vaihtoehto ennen äänestämistä!';
      warning.style.color = 'tomato';
      warning.style.marginTop = '8px';
      warning.style.opacity = '1';
      warning.style.transition = 'opacity 3s ease';
      event.target.insertAdjacentElement('afterend', warning);
      setTimeout(() => { warning.style.opacity = '0'; }, 10);
      setTimeout(() => { if (warning.parentNode) warning.parentNode.removeChild(warning); }, 3010);
      return;
    }

    const polls = getPolls();
    const poll = polls.find(p => p.title === pollTitle);
    const optionIndex = parseInt(selectedOption.id.split('opt')[1]);
    
    poll.options[optionIndex].votes++;
    savePolls(polls);

    // Merkitään äänestäjä ja estetään kaksoisäänestys
    poll.voters = poll.voters || [];

    // Jos ei ole aiemmin äänestänyt, lisätään käyttäjä listaan
    poll.voters.push(loggedInAs);
    savePolls(polls);
    // Lukitaan äänestys estämään lisääänestykset
    poll.locked = true;
    savePolls(polls);

    // Poistetaan äänestysnappi ja estetään vaihtoehtojen valinta
    const inputs = document.getElementsByName(`poll_${pollTitle}`);
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }

    const voteBtnEl = document.getElementById(`voteBtn${pollTitle}`);
    if (voteBtnEl) voteBtnEl.remove();

    // Näytetään viesti jossa ilmoitetaan että on jo äänestänyt
    const containerBtns = document.getElementById(`containerBtns${pollTitle}`);
    if (containerBtns) {
      const lockedMsg = document.createElement('span');
      lockedMsg.className = 'text-muted ps-2 pb-2 d-inline-block';
      lockedMsg.textContent = 'Olet jo äänestänyt';
      containerBtns.appendChild(lockedMsg);
    }
  }
});


function updatePollVoted() {
  const polls = getPolls();
  polls.forEach(poll => {
    const pollTitle = poll.title;
    const inputs = document.getElementsByName(`poll_${pollTitle}`);
    if (!inputs || inputs.length === 0) return;
    
    const voteBtnEl = document.getElementById(`voteBtn${pollTitle}`);
    const containerBtns = document.getElementById(`containerBtns${pollTitle}`);
    const userHasVoted = loggedInAs && Array.isArray(poll.voters) && poll.voters.includes(loggedInAs);

    if (userHasVoted) {
      // Lukitsee äänestyksen jos käyttäjä on jo äänestänyt
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
      if (voteBtnEl) voteBtnEl.remove();
      
      const existingMsg = document.getElementById(`lockedMsg${pollTitle}`);
      if (!existingMsg && containerBtns) {
        const msg = document.createElement('span');
        msg.id = `lockedMsg${pollTitle}`;
        msg.className = 'text-muted ps-2 pb-2 d-inline-block';
        msg.textContent = 'Olet jo äänestänyt';
        containerBtns.appendChild(msg);
      }
    } else {
      // Pitää äänestyksen avoinna jos käyttäjä ei ole vielä äänestänyt
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
      }
      const existingMsg = document.getElementById(`lockedMsg${pollTitle}`);
      if (existingMsg) existingMsg.remove();
    }
  });
}

// Näytä tulokset funktio ja event listenerit
function showResults(pollTitle) {
  const polls = getPolls();
  const poll = polls.find(p => p.title === pollTitle);
  if (!poll) return;

  // Tarkistaa onko tulokset näkyvissä
  const showingResults = document.querySelector(`label[for="${pollTitle}_opt0"]`).textContent.includes('ääntä');

  if (showingResults) {
    // Palauttaa normaaliin näkymään
    poll.options.forEach((opt, index) => {
      const label = document.querySelector(`label[for="${pollTitle}_opt${index}"]`);
      if (label) {
        label.innerHTML = escapeHtml(opt.name);
      }
    });
    return;
  }

  // Näyttää tulokset
  const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);

  poll.options.forEach((opt, index) => {
    const votes = opt.votes || 0;
    const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    const label = document.querySelector(`label[for="${pollTitle}_opt${index}"]`);
    
    if (label) {
      if (totalVotes === 0) {
        label.innerHTML = `${escapeHtml(opt.name)} (0 ääntä)`;
      } else {
        label.innerHTML = `${escapeHtml(opt.name)} - ${votes} ääntä (${percent}%)`;
      }
    }
  });
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Event listeneri katso tulokset napille
document.addEventListener('click', function(event) {
  if (!event.target || typeof event.target.id !== 'string') return;
  if (event.target.id.startsWith('checkVotesBtn')) {
    event.preventDefault();
    const pollTitle = event.target.id.replace('checkVotesBtn', '');
    showResults(pollTitle);
  }
});

function removePoll(pollTitle) {
  // Hakee kaikki äänestykset
  const polls = getPolls();
  // Poistaa äänestyksen
  const updatedPolls = polls.filter(p => p.title !== pollTitle);
  savePolls(updatedPolls);
  const pollElement = document.getElementById(`forRemove_${pollTitle}`)
  if (pollElement) {
    pollElement.remove();
  }
  console.log(`Äänestys "${pollTitle}" poistettu.`);
}

// Event listeneri poisto napeille
document.addEventListener("click", function(event) {
  if (event.target.id.startsWith("deleteBtn")) {
    const pollTitle = event.target.id.replace("deleteBtn", "");
    removePoll(pollTitle);
  }
});


