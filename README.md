# NetPass - Your new password manager

NetPass is a lightweight password manager web application designed to help users store, manage, and generate strong passwords in one centralised location.

## Running NetPass Locally

1. Clone the repo locally

```
git clone https://github.com/LeftsideMartian/Password-Manager-.NET.git
```

2. Start the backend api with the following:

```
cd backend/src
dotnet watch run
```

3. Start the frontend webapp with the following:

```
cd frontend
npm i
npm run dev
```

4. Open the webapp at http://localhost:5173

## Marking Assistance

| Rubric Item                                                     | Example                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Includes high cohesion and low coupling for classes and methods | Dependency injection with interfaces at ./backend/src/Program.cs:67-74    |
| Polymorphism                                                    | See above consuming service classes in Program.cs                         |
| Interfaces                                                      | See above                                                                 |
| NUnit tests                                                     | ./backend/tests/Services/PasswordGeneratorServiceTests.cs                 |
| Anonymous method with LINQ                                      | ./backend/src/Repositories/UserRepository.cs \|\| CredentialRepository.cs |
| Generics                                                        | ./backend/src/Services/CredentialService.cs:72 GetAllCredentials          |
