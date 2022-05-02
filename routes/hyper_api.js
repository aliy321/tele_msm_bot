const router = global.router;
const hyperModel = require("../models/hyper_model");

// add hyper
router.post("/add_hypers", async (request, response) => {
    console.log(request.body);

    // check if hyper already exists, if not, add hyper
    const find_hyper = await hyperModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_hyper);
    
    if(!find_hyper) {
        const hyper = new hyperModel(request.body);

        try {
            await hyper.save();
            response.send(hyper);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_hyper);
    }
});

// get all hypers
router.get("/hypers", async (request, response) => {
    const hypers = await hyperModel.find({});

    try {
        response.send(hypers);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get hyper by id
router.get("/hypers/:uid", async (request, response) => {
    const _id = await hyperModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

// edit linkskill by id
router.put("/hypers/:uid", async (request, response) => {
    // console.log(request.params.uid);

    // insertOne is used to insert a single document
    const data = await hyperModel.updateOne({
        uid: request.params.uid
    }, request.body);
    
    try {
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete hyper by id
router.delete("/hypers/:uid", async (request, response) => {
    const _id = await hyperModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router