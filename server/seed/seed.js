require("dotenv/config");
const mongoose = require("mongoose");
const User = require("../models/User");
const Producer = require("../models/Producer");
const BeerColor = require("../models/BeerColor");
const BeerType = require("../models/BeerType");
const Beer = require("../models/Beer");
const connectDB = require("../utils/connectDB");
const {
  mockBeerProducers,
  mockUsers,
  mockBeers,
  mockBeerTypes,
  mockBeerColors,
} = require("../mock/_mock");

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    const createdUsers = await User.create(mockUsers);
    return createdUsers;
  } catch (error) {
    throw error;
  }
};

const seedProducers = async (createdBy = null) => {
  try {
    await Producer.deleteMany({});
    const producersData = mockBeerProducers.map((producer) => ({
      ...producer,
      created_by: createdBy,
    }));
    const createdProducers = await Producer.insertMany(producersData);
    return createdProducers;
  } catch (error) {
    throw error;
  }
};

const seedBeerColors = async () => {
  try {
    await BeerColor.deleteMany({});
    const createdColors = await BeerColor.insertMany(mockBeerColors);
    return createdColors;
  } catch (error) {
    throw error;
  }
};

const seedBeerTypes = async () => {
  try {
    await BeerType.deleteMany({});

    const typesWithColorIds = await Promise.all(
      mockBeerTypes.map(async (type) => {
        const beerColor = await BeerColor.findOne({
          name: type.beer_color_name,
        });
        return {
          name: type.name,
          beer_color_id: beerColor._id,
        };
      })
    );

    const createdTypes = await BeerType.insertMany(typesWithColorIds);
    return createdTypes;
  } catch (error) {
    throw error;
  }
};

const seedBeers = async () => {
  try {
    await Beer.deleteMany({});

    const beersWithIds = await Promise.all(
      mockBeers.map(async (beer) => {
        const producer = await Producer.findOne({ name: beer.producer_name });
        const beerType = await BeerType.findOne({ name: beer.beer_type_name });
        const beerColor = await BeerColor.findOne({
          name: beer.beer_color_name,
        });

        return {
          name: beer.name,
          description: beer.description,
          producer_id: producer._id,
          beer_type_id: beerType._id,
          beer_color_id: beerColor._id,
          alcohol_percentage: beer.alcohol_percentage,
          ibu: beer.ibu,
          volume_ml: beer.volume_ml,
          price: beer.price,
          image_url: beer.image_url,
        };
      })
    );

    const createdBeers = await Beer.insertMany(beersWithIds);
    return createdBeers;
  } catch (error) {
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    const users = await seedUsers();
    const adminUser = users.find((u) => u.role === "ADMIN");
    await seedProducers(adminUser ? adminUser._id : null);
    await seedBeerColors();
    await seedBeerTypes();
    await seedBeers();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const seedOnlyUsers = async () => {
  try {
    await connectDB();
    await seedUsers();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const seedOnlyProducers = async () => {
  try {
    await connectDB();
    await seedProducers();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const seedOnlyBeerColors = async () => {
  try {
    await connectDB();
    await seedBeerColors();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const seedOnlyBeerTypes = async () => {
  try {
    await connectDB();
    await seedBeerColors();
    await seedBeerTypes();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const seedOnlyBeers = async () => {
  try {
    await connectDB();
    await seedProducers();
    await seedBeerColors();
    await seedBeerTypes();
    await seedBeers();
  } catch (error) {
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

const args = process.argv.slice(2);
const command = args[0];

if (require.main === module) {
  switch (command) {
    case "users":
      seedOnlyUsers();
      break;
    case "producers":
      seedOnlyProducers();
      break;
    case "colors":
      seedOnlyBeerColors();
      break;
    case "types":
      seedOnlyBeerTypes();
      break;
    case "beers":
      seedOnlyBeers();
      break;
    case "all":
    default:
      seedDatabase();
      break;
  }
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedProducers,
  seedBeerColors,
  seedBeerTypes,
  seedBeers,
  seedOnlyUsers,
  seedOnlyProducers,
  seedOnlyBeerColors,
  seedOnlyBeerTypes,
  seedOnlyBeers,
};
