const router = global.router;
const dataModel = require("../models/boss_model");

// add user
router.post("/boss", async (request, response) => {
    console.log(request.body);

    // check if user already exists, if not, add user
    const find_user = await dataModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_user);

    if (!find_user) {
        const user = new dataModel(request.body);

        try {
            await user.save();
            response.send(user);
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.send(find_user);
    }
});

// get all users
router.get("/boss", async (request, response) => {
    const users = await dataModel.find({});

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router