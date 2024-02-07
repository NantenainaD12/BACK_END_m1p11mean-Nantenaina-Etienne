// var UserModel = require('../../Model/Clients/UserModel')
// const getNextSequence = require('../../Model/Counter/Counter'); 
// var UserController = {
//     createUser: async(req,res) =>
//     {
//         try {
//             const name = req.body.name;
//             const quote = req.body.quote;

//             const UserModelData = new UserModel();
//             UserModelData._id = await getNextSequence('ram'),
//             UserModelData.name = name;
//             UserModelData.quote = quote;
//             console.log('eo mo lessy quotes'+UserModelData.quote);

//             await UserModelData.save();

//             res.status(200).send({
//                 "status": true, "message": "mandee"
//             });
            
//         } catch (error) {
//             console.log(error);
//             res.status(400).send(error);
//         }
//     },
//     GetAllQoutes: async(req,res) => {
//         try {
//             const quotes = await UserModel.find();
//             res.status(200).send(quotes);
//         } catch (error) {
//             res.status(500).send({ message: error.message });
//         }
//     },
//     DeleteQuotes: async(req,res) => {
//         try {
//             const name = req.query.name;
//             await UserModel.deleteOne({ name: name });
//             res.status(200).send({
//                 "status": true, 
//                 "message": "Quote deleted successfully"
//             });
//         } catch (error) {
//             res.status(500).send({ message: error.message });
//         }
//     }
    
    
// }

// module.exports = UserController;


// // var GetTest = async(req,res) =>
// // {
// //     console.log('tayy');
// // }