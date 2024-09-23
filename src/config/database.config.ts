// Create variables that hold env variables for database connection
const { DATABASE_HOST } = process.env;

// configure connection of mongodb database connection
export const databaseConfig = {
  // Define the URI for the database connection
  uri: `mongodb://${DATABASE_HOST}/elnursey`,
};
