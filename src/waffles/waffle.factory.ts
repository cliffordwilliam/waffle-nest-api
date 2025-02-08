// src/waffle/waffle.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Waffle } from './entities/waffle.entity';

export default setSeederFactory(Waffle, (faker) => {
  const waffle = new Waffle();

  waffle.name = faker.lorem.words(3); // Generate a name with 3 random words
  waffle.description = faker.lorem.sentence(); // Generate a random description
  waffle.price = parseFloat(faker.commerce.price({ min: 1, max: 10, dec: 2 })); // Random price between 1 and 10
  waffle.isGlutenFree = faker.datatype.boolean(); // Random boolean for isGlutenFree
  waffle.stockQuantity = faker.number.int({ min: 0, max: 100 }); // Random stock quantity between 0 and 100
  waffle.flavor = faker.lorem.word(); // Random flavor

  return waffle;
});
