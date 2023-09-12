import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
 
const app = express();

const httpServer = http.createServer(app);

const authors = [
  { id: '1', name: "John Doe" },
  { id: '2', name: "Jane Smith" },
];

const books = [
  { id: '1', title: "Book 1", authorId: '1' },
  { id: '2', title: "Book 2", authorId: '2' },
  { id: '3', title: "Book 3", authorId: '1' },
];

var typeDefs = `
type Query{
  hello: String
  books: [Book]
  authors: [Author]
}
type Book {
  id: ID
  title: String
  author: Author
}
type Author {
  id: ID
  name: String
  books: [Book]
}`;

var resolvers = {
  Query: {
    hello() {
      return "hello world";
    },
    books: () => books,
    authors: () => authors,
  },
  Book: {
    author: (book) => authors.find((author) => author.id === book.authorId),
  },
  Author: {
    books: (author) => books.filter((book) => book.authorId === author.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use('/graphql', 
  bodyParser.json(),
  expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`Server ready at http://localhost:4000/`);
