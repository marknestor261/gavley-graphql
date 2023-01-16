/**
 * @Author: Mark Okello
 * @Date:   14-01-2023 09:38:31
 * @Last Modified by:   Mark Okello
 * @Last Modified time: 14-01-2023 23:30:34
 */
const { GraphQLServer } = require('graphql-yoga');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://okeezy:1010@localhost:27017/gavley?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true });
let db;

client.connect((err) => {
    if (err) throw err;
    db = client.db("gavley");
});

const typeDefs = `
  type Rfiduid {
    userid: ID!
    name: String!
    rfiduid: String!
  }
  
  type Query {
    hello(name: String): String
    rfiduid(userid: ID!): Rfiduid
    users: [Rfiduid]
    getUsername(rfiduid: ID!): String
  }
  
  type Mutation {
    createRfiduid(userid: ID!, name: String!, rfiduid: String!): Rfiduid
  }
`

const resolvers = {
    Query: {
        hello: (_, args) => `Hello ${args.name || 'World'}!`,
        rfiduid: async (_, { userid }) => {
            return db.collection("rfiduid").findOne({ userid });
        },
        users: async () => {
            return db.collection("rfiduid").find({}).toArray();
        },
        getUsername: async (_, { rfiduid }) => {
          const rfidname = await db.collection("rfiduid").findOne({ rfiduid });
          return rfidname.name;
      
  }
        
    },
    Mutation: {
        createRfiduid: async (_, { userid, name, rfiduid }) => {
            const newRfiduid = { userid, name, rfiduid };
            await db.collection("rfiduid").insertOne(newRfiduid);
            return newRfiduid;
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running at http://localhost:4000`))
