using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace prepMeal.Migrations
{
    /// <inheritdoc />
    public partial class FixedDefaultValueFoodGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FoodGroup",
                table: "Ingredients",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldDefaultValue: "Others");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FoodGroup",
                table: "Ingredients",
                type: "TEXT",
                nullable: false,
                defaultValue: "Others",
                oldClrType: typeof(string),
                oldType: "TEXT");
        }
    }
}
