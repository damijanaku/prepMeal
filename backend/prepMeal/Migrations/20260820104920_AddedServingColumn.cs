using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace prepMeal.Migrations
{
    /// <inheritdoc />
    public partial class AddedServingColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "numberOfServings",
                table: "Recipes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "numberOfServings",
                table: "Recipes");
        }
    }
}
