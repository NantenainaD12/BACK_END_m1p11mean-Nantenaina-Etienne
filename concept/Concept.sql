db.clients.drop();
db.services.drop();
db.rdvservices.drop();
db.rdvs.drop();
db.offrespeciales.drop();
db.counters.drop();

db.counters.insertMany([
    { _id: 'Employe', __v: 0, seq: 8 },
    { _id: 'clients', __v: 0, seq: 3 },
    { _id: 'services', __v: 0, seq: 3 },
    { _id: 'offrespeciales', __v: 0, seq: 3 },
    { _id: 'rdvservices', __v: 0, seq: 0 },
    { _id: 'rdvs', __v: 0, seq: 0 },
]);

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
db.counters.updateOne({_id: "clients"}, {$set: {seq: 3}})

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

db.offrespeciales.insertMany([
    {
        _idOffreSpeciale: 1,
        description: "Happy New Year 2024",
        dateDebut: "2024-01-01T00:00:00",
        dateFin: "2024-01-15T00:00:00",
        idService: 1,
        pourcentageRemise: 0.3
    },
    {
        _idOffreSpeciale: 2,
        description: "Offre St Valentin",
        dateDebut: "2024-02-01T00:00:00",
        dateFin: "2024-02-14T00:00:00",
        idService: 2,
        pourcentageRemise: 0.2
    },
    {
        _idOffreSpeciale: 3,
        description: "Merry Christmas",
        dateDebut: "2023-12-01T00:00:00",
        dateFin: "2023-12-31T00:00:00",
        idService: 3,
        pourcentageRemise: 0.15 
    }
]);
