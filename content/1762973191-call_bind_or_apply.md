###### 11-12-2025
# Bind, call, and apply

Javascript functions have access to three methods: call, bind, and apply.

These three methods control what `this` refers to inside a function.

## call()

Invokes a function **immediately** with a specific `this` value.

```javascript
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello');
// Output: "Hello, I'm Alice"
```

**Arguments come individually**, separated by commas.

## apply()

Does the **same thing as call()**, but arguments come in an **array**.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'Bob' };

greet.apply(person, ['Hi', '!']);
// Output: "Hi, I'm Bob!"
```

## bind()

**Returns a new function** with `this` permanently set.

It doesn't invoke the function immediately.

```javascript
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const person = { name: 'Charlie' };

const boundGreet = greet.bind(person);

boundGreet('Hey');
// Output: "Hey, I'm Charlie"
```

## In Summary

- **call**: Run now, arguments one-by-one
- **apply**: Run now, arguments in an array
- **bind**: Create new function, run later
