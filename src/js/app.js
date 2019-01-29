App = {
    web3Provider: null,
    account: null,
    PubgInstance: null,
    PubgAddress: '0x2528ccdb4588a60bf6d67cb9e5f3ca1800f00d24',
    getAccount: function () {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(accounts[0]);
                }
            });
        });
    },

    initWeb3: function () {
        return new Promise((resolve, reject) => {
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider;
            } else {
                App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            }
            web3 = new Web3(App.web3Provider);
            if (web3 == null || typeof web3 === 'undefined') {
                return reject("Something went wrong");
            } else {
                return resolve("Successfully connected to Web3 Provider.");
            }
        });
    },

    initPubgContract: async () => {
        return new Promise((resolve, reject) => {
            $.getJSON('PUBG.json', function (data) {
                var Pubg = web3.eth.contract(data.abi);
                App.PubgInstance = Pubg.at(App.PubgAddress);
                return resolve(true);
            });
        });
    },


    createTeam: function () {
        let uuid1 = $('#uuid1').val();
        let uuid2 = $('#uuid2').val();
        let uuid3 = $('#uuid3').val();
        let uuid4 = $('#uuid4').val();
        let email1 = $('#email1').val();
        let email2 = $('#email2').val();
        let email3 = $('#email3').val();
        let email4 = $('#email4').val();

        App.PubgInstance.createTeam(
            email1,
            uuid1,
            email2,
            uuid2,
            email3,
            uuid3,
            email4,
            uuid4,
            {
                from: App.account,
                value: 1e18
            }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    $("#tx_hash").html("Track your tx: <a href='https://ropsten.etherscan.io/tx/" + res + "' target='_blank'>" + res + "</a>");
                }
            });
    },

    getBalance: function () {
        return new Promise((resolve, reject) => {
            App.PubgInstance.getBalance.call(function (error, result) {
                if (!error) {
                    return resolve(result);
                } else {
                    return reject(error);
                }
            });
        });
    },

    getTotalTeams: function () {
        return new Promise((resolve, reject) => {
            App.PubgInstance.getTotalTeams.call(function (error, result) {
                if (!error) {
                    return resolve(result);
                } else {
                    return reject(error);
                }
            });
        });
    },

    getWinnerProof: function () {
        return new Promise((resolve, reject) => {
            App.PubgInstance.getWinnerProof.call(function (error, result) {
                if (!error) {
                    return resolve(result);
                } else {
                    return reject(error);
                }
            });
        });
    },

    getWinnerAddress: function () {
        return new Promise((resolve, reject) => {
            App.PubgInstance.getWinnerAddress.call(function (error, result) {
                if (!error) {
                    return resolve(result);
                } else {
                    return reject(error);
                }
            });
        });
    }
};


$(async function () {
    $(document).on('click', '#join_tournament_button', App.createTeam);

    await App.initWeb3();
    await App.initPubgContract();
    let total_teams = await App.getTotalTeams();
    let prize_pool = await App.getBalance();
    let winner_address = await App.getWinnerAddress();
    let winner_proof = await App.getWinnerProof();
    $("#prize_pool").html((prize_pool.valueOf()) / 1e18);
    $("#total_teams").html(total_teams.valueOf());

    if (winner_address === "0x0000000000000000000000000000000000000000") {
        $("#winner_address").html("Not announced yet");
    } else {
        $("#winner_address").html(winner_address);
    }

    if (winner_proof === "") {
        $("#winner_proof").html("Not announced yet");
    } else {
        $("#winner_proof").html(winner_proof);
    }


});

function toHex(s) {
    var hex = '';
    for (var i = 0; i < s.length; i++) {
        hex += '' + s.charCodeAt(i).toString(16);
    }
    return `0x${hex}`;
}