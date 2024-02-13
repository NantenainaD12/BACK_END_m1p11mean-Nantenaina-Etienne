db.clients.insertMany([
    {
        _idClient: 1,
        nom: "Etienne Rakotoarison",
        email: "e.rakotoarison@email.com",
        mdp: "cli1",
        pdp: "pdp1",
        telephone: "0382211843"
    },
    {
        _idClient: 2,
        nom: "Natenaina Rh",
        email: "n.rh@email.com",
        mdp: "cli2",
        pdp: "pdp2",
        telephone: "0346741222"
    },
    {
        _idClient: 3,
        nom: "Zandry Gasy",
        email: "z.gasy@email.com",
        mdp: "cli3",
        pdp: "pdp3",
        telephone: "0348912643"
    }
]);

db.services.insertMany([
    {
        _idService: 1,
        description: "Sourcils",
        dureeMinute: 15,
        prix: 25000,
        commission: 0.05
    },
    {
        _idService: 2,
        description: "Barbe",
        dureeMinute: 20,
        prix: 26000,
        commission: 0.06
    },
    {
        _idService: 3,
        description: "Ongle",
        dureeMinute: 15,
        prix: 18000,
        commission: 0.04
    }
]);