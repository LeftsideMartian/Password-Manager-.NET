# NetPass - Your new password manager

NetPass is a lightweight password manager web application designed to help users store, manage, and generate strong passwords in one centralised location. Users can save logins, SSH keys and payment cards; every secret is encrypted with AES before it is written to the database.

- **Backend:** ASP.NET Core Web API (.NET 10), Entity Framework Core, SQLite, JWT authentication
- **Frontend:** React + TypeScript (Vite)
- **Tests:** NUnit

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (or Visual Studio 2022/2026 with it installed)
- [Node.js](https://nodejs.org/) 20 or newer (includes `npm`)
- The Entity Framework Core command-line tool (install once):

```
dotnet tool install --global dotnet-ef
```

## Running NetPass Locally

1. Clone the repo locally

```
git clone https://github.com/LeftsideMartian/Password-Manager-.NET.git
cd Password-Manager-.NET
```

2. Create the database. The app uses a SQLite file, `backend/src/netpass.db`. Delete any old copy first (including `netpass.db-wal` and `netpass.db-shm` if present) so it is rebuilt with every table, then create and apply the migration:

```
cd backend/src
dotnet ef migrations add Initial
dotnet ef database update
```

This creates the `users`, `credential`, `login`, `ssh_key`, `payment_card` and `shared_link` tables. If a `Migrations` folder already exists in `backend/src`, skip `migrations add` and only run `dotnet ef database update`.

3. Start the backend API (still in `backend/src`):

```
dotnet watch run
```

The API runs at http://localhost:5126. Swagger, for trying the endpoints directly, is at http://localhost:5126/swagger.

4. In a second terminal, start the frontend web app:

```
cd frontend
npm i
npm run dev
```

5. Open the web app at http://localhost:5173

6. Register an account on the login screen, then sign in. You can now add, view, edit and delete credentials in **My vault**. For a payment card, use a valid test number such as `4111 1111 1111 1111`; the backend rejects numbers that fail the card-number check.

## Running the Tests

From the `backend` folder:

```
cd backend
dotnet test
```

## Troubleshooting

- **`no such table: credential`** - the database was created before the credential tables existed. Stop the backend, delete `backend/src/netpass.db` (and the `-wal`/`-shm` files), and repeat step 2.
- **`dotnet ef` is not recognised** - install the tool (see Prerequisites) and open a new terminal.
- **Frontend shows "Request failed"** - make sure the backend is running on port 5126 before using the web app.

## Marking Assistance

| Rubric Item                                                     | Example                                                                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Includes high cohesion and low coupling for classes and methods | Controller → Service → Repository layers, wired together with dependency injection in `./backend/src/Program.cs:68-74`        |
| Interfaces                                                      | `ICredentialService`, `ICredentialRepository`, `IEncryptionService`, `IUserService`, `IJwtService` (registered in `Program.cs:68-74`) |
| Inheritance                                                     | `./backend/src/Models/Credential.cs:8` abstract `Credential`, extended by `Login`, `SshKey` and `PaymentCard`                  |
| Polymorphism                                                    | `./backend/src/DTO/Credential/CredentialDto.cs:9-17` polymorphic JSON (`type` field) and a `switch` on the credential's type   |
| Generics                                                        | `./backend/src/Services/CredentialService.cs:131` `FindOwned<T>` where `T : Credential`                                        |
| Anonymous method with LINQ                                      | `./backend/src/Repositories/CredentialRepository.cs:31` and `:47` (`Where` / `Select` with lambdas)                            |
| NUnit tests                                                     | `./backend/tests/NetPass.Tests/Services/PasswordGeneratorServiceTests.cs`                                                      |