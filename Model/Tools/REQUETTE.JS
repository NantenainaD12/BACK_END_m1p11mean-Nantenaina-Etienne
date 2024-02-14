const mongoose = require('mongoose');

// Connectez-vous à votre base de données MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // Nous sommes connectés !

    // Définissez votre requête d'agrégation
    const aggregation = [
        {
            $lookup:
            {
                from: "ram",
                localField: "id_ram",
                foreignField: "id_ram",
                as: "ram_info"
            }
        },
        {
            $lookup:
            {
                from: "rom",
                localField: "id_rom",
                foreignField: "id_rom",
                as: "rom_info"
            }
        },
        {
            $match: 
            {
                "ram_info.valeur": { $gt: 8 },
                "rom_info.valeur": { $gt: 250 }
            }
        }
    ];

    // Exécutez la requête d'agrégation
    db.collection('laptop').aggregate(aggregation).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);
        db.close();
    });
});
