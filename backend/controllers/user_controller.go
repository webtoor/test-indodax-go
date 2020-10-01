package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/models"
)

// Find One ...
func Find(c *gin.Context) {
	user := models.User{}
	userID := uint(c.MustGet("jwt_user_id").(float64))
	configs.DB.Where("user_id = ?", userID).First(&user)
	c.JSON(http.StatusOK, gin.H{"status": 200, "data": user})
}
