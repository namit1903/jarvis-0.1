import userModel from '../models/user.model.js';



export const createUser = async ({
    email, password
}) => {
    try{
    // console.log("we are in user service")
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);
    // console.log("we are in user service")
    const user = await userModel.create({
        email,
        password: hashedPassword
    });
    console.log("we are in user service")
    return user;
}catch(err) {
    console.log("error cautght by catch block",err.message);
    console.log(err)
}

}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}