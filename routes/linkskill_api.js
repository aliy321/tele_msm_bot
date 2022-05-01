const router = global.router;
const linkSkillModel = require("../models/linkskill_model");

// add linkskill
router.post("/add_linkskills", async (request, response) => {
    console.log(request.body);

    // check if linkskill already exists, if not, add linkskill
    const find_linkskill = await linkSkillModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_linkskill);
    
    if(!find_linkskill) {
        const linkskill = new linkSkillModel(request.body);

        try {
            await linkskill.save();
            response.send(linkskill);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_linkskill);
    }
});

// get all linkskills
router.get("/linkskills", async (request, response) => {
    const linkskills = await linkSkillModel.find({});

    try {
        response.send(linkskills);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get linkskill by id
router.get("/linkskills/:uid", async (request, response) => {
    console.log(request.params.uid);

    const data = await linkSkillModel.findOne({
        uid: request.params.uid
    });

    try {
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// edit linkskill by id
router.put("/linkskills/:uid", async (request, response) => {
    // console.log(request.params.uid);

    // insertOne is used to insert a single document
    const data = await linkSkillModel.updateOne({
        uid: request.params.uid
    }, request.body);

    

    try {
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete linkskill by id
router.delete("/linkskills/:uid", async (request, response) => {
    const _id = await linkSkillModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router