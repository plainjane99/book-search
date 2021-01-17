// import the models
const { User, Book } = require('../models');

// import authentication error handling from Apollo
const { AuthenticationError } = require('apollo-server-express');

// import signToken
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {

        // authenticate and get user's data
        me: async (parent, args, context) => {
            // if authentication info exists, return user data
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }
            // if authentication info does not exist, throw AuthenticationError
            throw new AuthenticationError('Not logged in');
        },

        // savedBooks: async (parent, { username }) => {
        //     const params = username ? { username } : {};
        //     return Book.find(params);
        // },

        // book: async (parent, { _id }) => {
        //     return Book.findOne({ _id });
        // }

    },

    Mutation: {

        addUser: async (parent, args) => {
            // create with args passed in
            const user = await User.create(args);
            // create a token with the user data
            const token = signToken(user);
            // return the token and user info
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            // find user with provided email
            const user = await User.findOne({ email });

            // if no user found, use apollo's error handling to send back to the client that error was made
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // define a variable to hold boolean of password correctness
            const correctPw = await user.isCorrectPassword(password);

            // if password is not correct, use apollo's error handling to send back to the client that password is invalid
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // if email and password are good, create a token 
            const token = signToken(user);

            // return the token and user info
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            // only if users are logged in will the method run
            if (context.user) {

                console.log("This is the input that was received: " + args);
                console.log("This is the user ID: " + context.user._id);

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args } },
                    // return the updated document
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');

        },
    }
};

module.exports = resolvers;