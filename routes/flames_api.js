const router = global.router;
const flameModel = require("../models/flames_model");

// add flame
router.post("/add_flames", async (request, response) => {
    console.log(request.body);

    // check if flame already exists, if not, add flame
    const find_flame = await flameModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_flame);
    
    if(!find_flame) {
        const flame = new flameModel(request.body);

        try {
            await flame.save();
            response.send(flame);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_flame);
    }
});

// get all flames
router.get("/flames", async (request, response) => {
    const flames = await flameModel.find({});

    try {
        response.send(flames);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get flame by id
router.get("/flames/:uid", async (request, response) => {
    const _id = await flameModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete flame by id
router.delete("/flames/:uid", async (request, response) => {
    const _id = await flameModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router