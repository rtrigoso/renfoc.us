###### 11-04-2025
# This Quirky Javascript

I was halfway through a technical interview when the interviewer leaned back and asked, "Why couldn't you use an arrow function there?"

I'd just written a function that wraps a callback and ensures it only runs once, no matter how many times you call it. My code worked. The tests passed. But his question made me pause, because I knew exactly what he was testing.

Here's what I wrote:

```javascript
function once(func) {
  var called = false;
  var result;
  
  return function() {
    if (!called) {
      called = true;
      result = func.apply(this, arguments);
    }
    return result;
  };
}
```

If I'd used an arrow function for that inner return—`return () => {`—everything would break. The reason comes down to how `this` actually works in JavaScript.

## "this" Works Differently Than You Think

Here's the thing about `this`: it doesn't behave like other variables.

Think of `this` like a pronoun. When you say "I'm hungry," the word "I" refers to you. When I say "I'm hungry," that same word suddenly refers to me. The word stays the same, but who it points to changes based on who's speaking.

Most JavaScript variables follow lexical scoping—they're determined by where you write the code:

```javascript
function outer() {
  const name = "Alice";
  
  function inner() {
    console.log(name); // "Alice"
  }
  
  inner();
}
```

When `inner()` runs, JavaScript looks for `name` in its local memory, doesn't find it, then checks the parent scope where `outer` defined it. The scope chain is fixed by where you write the code, not where you call it.

But `this` doesn't work this way. The value of `this` is determined by how you call the function, not where you write it. Look at this:

```javascript
const person = {
  name: "Alice",
  greet: function() {
    console.log("Hello, I'm " + this.name);
  }
};

person.greet(); // "Hello, I'm Alice"

const greetFunction = person.greet;
greetFunction(); // "Hello, I'm undefined"
```

Same function, two different results. The only thing that changed was how we called it.

## Four Ways to Bind "this"

### 1. Default Binding

Call a function by itself and `this` becomes the global object (or `undefined` in strict mode):

```javascript
function showThis() {
  console.log(this);
}

showThis(); // Window or global or undefined
```

This trips people up when they extract a method from an object. The moment you store `person.greet` in a variable, you've separated the function from its object. Now it's just a standalone function call.

### 2. Implicit Binding

Call a function as a method using dot notation, and `this` becomes the object to the left of the dot:

```javascript
const user = {
  name: "Bob",
  describe: function() {
    console.log(this.name);
  }
};

user.describe(); // "Bob" - this = user
```

With nested objects, only the immediate parent matters:

```javascript
company.employee.greet(); // this = employee, not company
```

### 3. Explicit Binding

Sometimes you need to explicitly set what `this` should be. That's what `call`, `apply`, and `bind` do:

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person = { name: "Diana" };
greet.call(person); // "Hello, I'm Diana"
```

The difference between them: `call` takes individual arguments, `apply` takes an array, and `bind` returns a new function with `this` locked in permanently.

This is where my interview code comes in. Look at that line again:

```javascript
result = func.apply(this, arguments);
```

I'm using `apply` to forward whatever `this` the wrapper received to the original callback. If someone calls the wrapper as a method, the callback should also run as a method with the same `this`.

### 4. Arrow Functions

Arrow functions break all these rules. They don't have their own `this` at all. Instead, they capture `this` from their parent scope—just like regular variables do:

```javascript
const person = {
  name: "Ivy",
  hobbies: ["reading", "coding"],
  showHobbies: function() {
    this.hobbies.forEach((hobby) => {
      console.log(`${this.name} likes ${hobby}`);
    });
  }
};

person.showHobbies(); 
// "Ivy likes reading"
// "Ivy likes coding"
```

The arrow function doesn't get its own `this`. It looks up the scope chain and uses `this` from `showHobbies`, where it correctly points to `person`.

You can't change an arrow function's `this` with `call`, `apply`, or `bind`. Once it captures `this`, that binding is permanent.

## Why the Interview Question Matters

Back to my `once` function. Here's what happens when someone uses it:

```javascript
const counter = {
  count: 0,
  increment: once(function() {
    this.count++;
    console.log(`Count is now ${this.count}`);
  })
};

counter.increment(); // "Count is now 1"
counter.increment(); // (nothing - already called once)
```

When `counter.increment()` runs, the wrapper function is called as a method, so `this` points to `counter`. I use `func.apply(this, arguments)` to pass that `this` along to the callback. Everything works.

But if I'd used an arrow function:

```javascript
return () => {  // Arrow function
  if (!called) {
    result = func.apply(this, arguments);  // Wrong 'this'!
  }
  return result;
};
```

The arrow function would capture `this` from inside the `once` function—where `this` is the global object or undefined, because `once` itself was called as a regular function. The callback would get the wrong `this`, and `this.count++` would fail.

The interviewer knew this was subtle. Arrow functions look modern and feel natural for callbacks. But here, we specifically need the dynamic `this` binding that regular functions provide.

## Choosing the Right Function

Use regular functions when you need `this` from the call site—like my `once` wrapper, object methods, or constructors.

Use arrow functions when you want `this` from the surrounding scope—callbacks, array methods, event handlers.

```javascript
// Arrow function - good
class Timer {
  start() {
    setInterval(() => {
      this.seconds++;  // Captures 'this' from start()
    }, 1000);
  }
}

// Arrow function - bad
const calculator = {
  value: 0,
  add: (n) => {
    this.value += n;  // 'this' is NOT calculator!
  }
};
```

When the interviewer asked about arrow functions, I explained the difference. Regular functions get `this` from their caller. Arrow functions get `this` from their author. In this case, I needed the caller's context, not the author's.

That understanding made all the difference.
