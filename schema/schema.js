const graphql = require('graphql');
const axios = require('axios');
//const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

// const users = [
//     { id: 'abc', firstName: 'long', age: 21 },
//     { id: 'def', firstName: 'vuong', age: 21 },
// ];

const URL_API = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`${URL_API}/companies/${parentValue.companyId}`)
                    .then(res => res.data);
            }
        }
    }
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                //return _.find(users, { id: args.id });
                return axios.get(`${URL_API}/users/${args.id}`).then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});