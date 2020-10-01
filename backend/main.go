package main

import (
	"log"

	"github.com/gin-gonic/autotls"
	"github.com/joho/godotenv"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/routers"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}
func main() {
	configs.InitDatabase()
	defer configs.DB.Close()
	r := routers.SetupRouter()

	log.Fatal(autotls.Run(r, "api.vuenic.com"))
	//r.Run(":8000")
}
