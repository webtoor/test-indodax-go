package configs

import (
	"os"

	"github.com/jinzhu/gorm"
	// Dialects-mysql
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
)

// DB ...
var DB *gorm.DB

// InitDatabase ...
func InitDatabase() {
	var err error
	godotenv.Load()
	dbType := os.Getenv("DB_TYPE")
	dbConn := os.Getenv("DB_CONN")
	DB, err = gorm.Open(dbType, dbConn)
	if err != nil {
		panic("failed to connect database")
	}

}
