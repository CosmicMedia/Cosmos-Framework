/*Why ARE we injecting one?
The compiler injects .get() to any variable used.

let var = variable('test')

var.get() //returns 'test'

but we want this to be invisible

Here's the issue though. What happens when this becomes an object?

so

let var = variable({ test: variable('test') });

^ that's the result we want right?
var.get().test.get()

But what if the variable being referred to is NOT a reactive variable.

If you're importing something from an external library. (which is outside the scope of the compiler)
What value could it have that is NOT a reactive type?

Does that actually show in the object when you iterate the keys?

Well, 
Object.entries(_variable) <- does it show in here?

I basically want usable to find all instances of a property not being a reactive var and make it one.

So you want to wrap EVERYTHING in the object in a usable? Not in usable directly, but a variable() nonetheless. 			

let var = variable({ test: 'test' });

gets transformed to:'

let external_var = "string"; //raw string

//This makes it readable for the .get() synax
usable(external_var).get()

So can't you just iterate over Object.entries and check the type to see if it's type variable?

You also need to do the same for child properties too.

which is the recursive check

so all you have to do is see if Object.entries is null or undefined for that entry and then if it's not, recursively apply the same logic as above


let external_object = { test: { test2: 'nested var' } }

the first Object.entries will get you to the initial test


psudo code

What if input is already reactive but some of the children elements aren't?

we just check.

example:

let external_object = variable({ test: { test2: 'nested var' } })

the outer layer is a variable, but the nested inner layers are NOT 

So when we iterate over Objet.entries(external_object)

we get that first entry: "test"

we can then do:

try {
test.get()
} catch {
//Make it a var
}

then check to see if test has children with Object.entries
If it does, then recursively keep checking with the same logic

ez

so to continue the example, at this stage it detected that the entry "test" on the initial entry was NOT readable

so it get's transformed to:

let external_object = variable({ test: variable({ test2: 'nested var' }) })

Now we check to see if that child node has entries: Object.entries(test)

and we see that it DOES have children, so we check

try {
test2.get();
} catch {
//Make it a var
}

we see again that test2 isn't readable, so we make it so

let external_object = variable({ test: variable({ test2: variable('nested var') }) })


Object is now readable

ez


Your response: 
That should work. Anyway lets remove all this lol.

not till we implement it. That way we can see our thought process when we get confused

This is too much text to put here. Lets move it.

^^^^

You wanna do it?

So we just call the function it's running in?


FN USABLE ()
IF INPUT IS OBJECT
USABLE()

INPUT.GET()

IF INPUT IS OBJECT
THEN ENTRIES CRAP
ELSE IF INPUT IS ARRAY
THEN ITERATE CRAP
*/