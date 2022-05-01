const router = global.router;
const userModel = require("../models/users_model");

// add user
router.post("/add_users", async (request, response) => {
    console.log(request.body);

    // check if user already exists, if not, add user
    const find_user = await userModel.findOne({
        uid: request.body.uid
    });

    // console.log(find_user);
    
    if(!find_user) {
        const user = new userModel(request.body);

        try {
            await user.save();
            response.send(user);
        } catch (error) {
            response.status(500).send(error);
        }
    }else{
        response.send(find_user);
    }
});

// get all users
router.get("/users", async (request, response) => {
    const users = await userModel.find({});

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get user by id
router.get("/users/:uid", async (request, response) => {
    const _id = await userModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete user by id
router.delete("/users/:uid", async (request, response) => {
    const _id = await userModel.find({uid : request.params.uid});
    console.log(_id);

    try {
        response.send(_id);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router