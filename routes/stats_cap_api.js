const router = global.router;
const stats_capModel = require("../models/stats_cap_model");

// add stats_cap
router.post("/add_stats_caps", async (request, response) => {
    console.log(request.body);

    // check if stats_cap already exists, if not, add stats_cap
    const find_stats_cap = await stats_capModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_stats_cap);
    
    if(!find_stats_cap) {
        const stats_cap = new stats_capModel(request.body);

        try {
            await stats_cap.save();
            response.send(stats_cap);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_stats_cap);
    }
});

// get all stats_caps
router.get("/stats_caps", async (request, response) => {
    const stats_caps = await stats_capModel.find({});

    try {
        response.send(stats_caps);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get stats_cap by id
router.get("/stats_caps/:uid", async (request, response) => {
    const _id = await stats_capModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete stats_cap by id
router.delete("/stats_caps/:uid", async (request, response) => {
    const _id = await stats_capModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router