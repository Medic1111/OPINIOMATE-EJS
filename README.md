# PROJECT

- Create a Opinion platform
- Random topic generated daily
- User will be able to type a single opinion on the topic
- That will be rewritten once a new topic appears
- The name will be available dynamically
- All opinions will be rendered in the opinion page
- Root will require registration and login
- MongoDB-Atlas for Database
- Express Session for cookies and session
- Passport for Encryption, hash, salting, authentications
- Only those authenticated will see posts page

---

[TECH]:

- NodeJS, Express, EJS, PASSPORT, THIRD-PARTY-API, EXPRESS-SESSION, MONGODB

# START

- Download project and open it on your favorite IDE

- On the terminal, run: npm init

- Once dependencies are downloaded, run the command: node index.js

- Alternatively, if nodemon is installed, run: nodemon index.js

[TESTING_CREDENTIALS]:

Username: test@test.com
Password: test

# PLAN OF ACTION:

# STEP ONE: ROOT(HOME)

- At root, a welcome, log in button, and register button will be display.
- Register button will redirect to Register Route
- Log in button will redirect to Login Route

# REGISTER

- If successful, redirect to Posts
- Else, Redirect to Register

# LOG IN

- If Successfull, redirect to Posts
- Else, redirect to Log In

# SESSION OVER (Closing Browsing Session or LOGOUT)

- If Session Over Redirect to Log In
- If LOGOUT Redirect to ROOT (Home)
