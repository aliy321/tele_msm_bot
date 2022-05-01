const router = global.router;
const jewelModel = require("../models/jewel_model");

// add jewel
router.post("/add_jewel", async (request, response) => {
    // console.log(request.body[0]['uid']);

    // check if user already exists, if not, add user
    const find_jewel = await jewelModel.findOne({
        uid: request.body['uid']
    });

    // console.log(find_user);
    
    if(!find_jewel) {
        const jewel = new jewelModel(request.body);

        try {
            await jewel.save();
            response.send(jewel);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_jewel);
    }
});

// get all jewel
router.get("/jewel", async (request, response) => {
    const jewel = await jewelModel.find({});

    try {
        response.send(jewel);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get jewel by name
router.get("/jewel/:name", async (request, response) => {
    const _id = await jewelModel.find({
        name: request.params.name
    });
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete jewel by id
router.delete("/jewel/:uid", async (request, response) => {
    const _id = await jewelModel.find({
        uid: request.params.uid
    });
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router