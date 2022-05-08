const router = global.router;
const model = require("../models/soul_model");

// add flame
router.post("/add_soul", async (request, response) => {
    console.log(request.body);

    // check if flame already exists, if not, add flame
    const find_model = await model.findOne({
        uid: request.body.uid
    });

    // console.log(find_model);
    
    if(!find_model) {
        const flame = new model(request.body);

        try {
            await flame.save();
            response.send(flame);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_model);
    }
});

// get all soul
router.get("/soul", async (request, response) => {
    const soul = await model.find({});

    try {
        response.send(soul);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get flame by id
router.get("/soul/:uid", async (request, response) => {
    const _id = await model.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put("/soul/:uid", async (request, response) => {
    // console.log(request.params.uid);

    // insertOne is used to insert a single document
    const data = await model.updateOne({
        uid: request.params.uid
    }, request.body);

    try {
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete flame by id
router.delete("/soul/:uid", async (request, response) => {
    const _id = await model.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router