const apiURL = window.location.origin + '/api';

window.onload = (event) => {
    console.log(apiURL);
    const endpoint = window.location.pathname;
    console.log(endpoint);
    if (endpoint == '/lobby') {
        const gameId = getParameterByName('id');
        const gameIdField = document.querySelector('#gameId');
        gameIdField.innerHTML = 'Game ID: ' + gameId;
        fetch(apiURL + '/players?id=' + gameId)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then(json => {
                        const board = document.querySelector('.players');
                        for (let i = 0; i < json.length; i++) {
                            const e = json[i];
                            board.innerHTML += `<div ><p>${e.name}</p></div>`;
                        }
                        setInterval(updateLobby, 2500, gameId, false);
                        console.log(json);
                    })
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }
    else if (endpoint == '/scoreboard') {
        const gameId = getParameterByName('id');
        fetch(apiURL + '/players?id=' + gameId)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then(json => {
                        const board = document.querySelector('.players');
                        for (let i = 0; i < json.length; i++) {
                            const e = json[i];
                            board.innerHTML += `<div ><p>${e.name}: ${e.score}</p></div>`;
                        }
                        setInterval(updateLobby, 2500, gameId, true);
                        console.log(json);
                    })
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }
}

function compare(a, b) {
    if (a.score > b.score) {
        return -1;
    }
    if (a.score < b.score) {
        return 1;
    }
    return 0;
}


function updateLobby(gameId, score) {
    console.log('update lobby');
    $.get(apiURL + '/players?id=' + gameId, function (data, status) {
        const board = document.querySelector('.players');
        board.innerHTML = '';
        data.sort(compare);
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            if (score) {
                board.innerHTML += `<div ><p>${e.name}: ${e.score}</p></div>`;
            }
            else {
                board.innerHTML += `<div ><p>${e.name}</p></div>`;
            }
        }
    });

    //check status
    $.get(apiURL + '/getGame?id=' + gameId, function (data, status) {
        if (!score) {
            if (data.status != 0) {
                navigate('scoreboard?id=' + gameId);
            }
        }
        else {
            const phrase = document.querySelector('#phrase');
            console.log(data);
            phrase.innerHTML = 'Restore: '+data.phrase.scrambled;
        }
    });
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function navigate(endpoint) {
    const url = window.location.origin + '/' + endpoint;
    console.log(url);
    window.location.href = url;
}

function start() {
    const gameId = getParameterByName('id');
    fetch(apiURL + '/startGame?id=' + gameId)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    alert('something went wrong');
                    return;
                }
                response.text().then(text => {
                    navigate('scoreboard?id=' + text);
                })
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function validatePhone(phone) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phone.match(phoneno)) {
        return true;
    }
    else {
        alert("invalid phone number.");
        return false;
    }
}

function validateName(name) {
    if (name.length < 2 || name.length > 12) {
        alert('name must be between 2 and 12 characters');
        return false;
    }
    else {
        return true;
    }
}

function newGame() {
    let phone = document.querySelector('#phone').value;
    const name = document.querySelector('#name').value;

    if (validatePhone(phone) && validateName(name)) {
        phone = phone.replace(/\s/g, '');
        fetch(apiURL + '/newgame?name=' + name + '&phone=' + phone)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.text().then(text => {
                        navigate('lobby?id=' + text);
                    })
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }

    console.log(phone + " " + name);
}

function joinGame() {
    const phone = document.querySelector('#phone').value;
    const name = document.querySelector('#name').value;
    const gameId = document.querySelector('#gameId').value;

    if (validatePhone(phone) && validateName(name)) {
        fetch(apiURL + '/joingame?name=' + name + '&phone=' + phone + '&id=' + gameId)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        alert('cannot find game');
                        return;
                    }
                    response.text().then(text => {
                        navigate('lobby?id=' + text);
                    })
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }

    console.log(phone + " " + name);
}