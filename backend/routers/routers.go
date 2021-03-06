package routers

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	ctrl "github.com/webtoor/test-indodax-go/backend/controllers"
	middleware "github.com/webtoor/test-indodax-go/backend/middleware"
)

// SetupRouter ...
func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello World",
		})
	})
	api := r.Group("api/")
	{
		api.POST("/signup", ctrl.SignUp)
		api.POST("/signin", ctrl.SignIn)
		api.GET("/user", middleware.JwtMiddleware(), ctrl.FindUser)
		api.GET("/transaction", middleware.JwtMiddleware(), ctrl.FindHistory)
		api.POST("/transaction", middleware.JwtMiddleware(), ctrl.CreateTransaction)

	}
	return r
}
