const graphql = require('graphql');
const axios = require('axios');
//const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// const users = [
//     { id: 'abc', firstName: 'long', age: 21 },
//     { id: 'def', firstName: 'vuong', age: 21 },
// ];

const URL_API = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        user: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${URL_API}/companies/${parentValue.id}/users`)
                    .then(res => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
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
    })
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
        },
        company: {
            type: CompanyType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${URL_API}/companies/${args.id}`)
                    .then(res => res.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                company: {
                    type: GraphQLString
                },
            },
            resolve(parentValue, args) {
                return axios.post(`${URL_API}/users`, args)
                    .then(res => res.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parentValue, args) {
                return axios.delete(`${URL_API}/users/${args.id}`, args)
                    .then(res => res.data);
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                firstName: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                },
                companyId: {
                    type: GraphQLString
                },
            },
            resolve(parentValue, args) {
                return axios.patch(`${URL_API}/users/${args.id}`, args)
                    .then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});