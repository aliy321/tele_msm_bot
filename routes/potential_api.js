const router = global.router;
const potentialModel = require("../models/potentials_model");

// add potential
router.post("/add_potentials", async (request, response) => {
    console.log(request.body);

    // check if potential already exists, if not, add potential
    const find_potential = await potentialModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_potential);
    
    if(!find_potential) {
        const potential = new potentialModel(request.body);

        try {
            await potential.save();
            response.send(potential);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_potential);
    }
});

// get all potentials
router.get("/potentials", async (request, response) => {
    const potentials = await potentialModel.find({});

    try {
        response.send(potentials);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get potential by id
router.get("/potentials/:uid", async (request, response) => {
    const _id = await potentialModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put("/potentials/:uid", async (request, response) => {
    // console.log(request.params.uid);

    // insertOne is used to insert a single document
    const data = await potentialModel.updateOne({
        uid: request.params.uid
    }, request.body);

    try {
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete potential by id
router.delete("/potentials/:uid", async (request, response) => {
    const _id = await potentialModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router