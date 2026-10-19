using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetPass.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    first_name = table.Column<string>(type: "TEXT", nullable: false),
                    last_name = table.Column<string>(type: "TEXT", nullable: false),
                    email = table.Column<string>(type: "TEXT", nullable: false),
                    password = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "credential",
                columns: table => new
                {
                    credential_id = table.Column<int>(type: "INTEGER", nullable: false),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    notes = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_credential", x => x.credential_id);
                    table.ForeignKey(
                        name: "fk_credential_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "login",
                columns: table => new
                {
                    credential_id = table.Column<int>(type: "INTEGER", nullable: false),
                    username = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    password = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_login", x => x.credential_id);
                    table.ForeignKey(
                        name: "fk_login_credential_credential_id",
                        column: x => x.credential_id,
                        principalTable: "credential",
                        principalColumn: "credential_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payment_card",
                columns: table => new
                {
                    credential_id = table.Column<int>(type: "INTEGER", nullable: false),
                    card_number = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    expiry_date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    cvv = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment_card", x => x.credential_id);
                    table.ForeignKey(
                        name: "fk_payment_card_credential_credential_id",
                        column: x => x.credential_id,
                        principalTable: "credential",
                        principalColumn: "credential_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "shared_link",
                columns: table => new
                {
                    link_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    shared_user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    credential_id = table.Column<int>(type: "INTEGER", nullable: false),
                    url = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    expiry_date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    remaining_uses = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_shared_link", x => x.link_id);
                    table.ForeignKey(
                        name: "fk_shared_link_credential_credential_id",
                        column: x => x.credential_id,
                        principalTable: "credential",
                        principalColumn: "credential_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_shared_link_users_shared_user_id",
                        column: x => x.shared_user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ssh_key",
                columns: table => new
                {
                    credential_id = table.Column<int>(type: "INTEGER", nullable: false),
                    key = table.Column<string>(type: "TEXT", maxLength: 10000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ssh_key", x => x.credential_id);
                    table.ForeignKey(
                        name: "fk_ssh_key_credential_credential_id",
                        column: x => x.credential_id,
                        principalTable: "credential",
                        principalColumn: "credential_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_credential_user_id",
                table: "credential",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_shared_link_credential_id",
                table: "shared_link",
                column: "credential_id");

            migrationBuilder.CreateIndex(
                name: "ix_shared_link_shared_user_id",
                table: "shared_link",
                column: "shared_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "login");

            migrationBuilder.DropTable(
                name: "payment_card");

            migrationBuilder.DropTable(
                name: "shared_link");

            migrationBuilder.DropTable(
                name: "ssh_key");

            migrationBuilder.DropTable(
                name: "credential");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
