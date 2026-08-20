using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace prepMeal.Migrations
{
    /// <inheritdoc />
    public partial class AddNumberOfServingsToRecipeFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "numberOfServings",
                table: "Recipes",
                newName: "NumberOfServings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NumberOfServings",
                table: "Recipes",
                newName: "numberOfServings");
        }
    }
}
