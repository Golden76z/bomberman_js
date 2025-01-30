# Classes

In JavaScript, a class is a blueprint for creating objects that share common properties and methods.

## Contructor and properties instanciations

The constructor() is a special method that gets called automatically when a new instance of the class is created using the new keyword.
A class can only have one contructor. Contructor are used to initialize properties.

```js
class Car {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

const myCar = new Car('Toyota', 'Corolla', 2020);
console.log(myCar);
// Car { make: 'Toyota', model: 'Corolla', year: 2020 }
```

## Methods inside classes

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  // Method inside a class
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

// Creating a new class
const dog = new Animal('Dog');
// Calling the method inside that new created class
dog.speak();
// Output: Dog makes a noise.
```

## Accessor methods (getter and setter)

```js
class Circle {
  constructor(radius) {
    this._radius = radius;
  }

  // Getter
  get radius() {
    return this._radius;
  }

  // Setter
  set radius(value) {
    if (value > 0) {
      this._radius = value;
    } else {
      console.log("Invalid radius");
    }
  }
}

const circle = new Circle(5);
console.log(circle.radius);  // 5
circle.radius = 10;
console.log(circle.radius);  // 10
circle.radius = -5;          // Invalid radius
```

## Inheritance

A class can inherit properties of others classes using the 'extends' keyword.
This class can then use the methods stored on the top level class.



```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Calls the constructor of the parent class (Animal)
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak();  // Rex barks.
```
