package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/models"
)

// FindHistory ...
func FindHistory(c *gin.Context) {
	transaction := []models.Transaction{}
	userID := uint(c.MustGet("jwt_user_id").(float64))
	configs.DB.Preload("Sender").Preload("Receiver").Where("sender_id = ?", userID).Find(&transaction)
	c.JSON(http.StatusOK, gin.H{"status": 200, "data": transaction})
}
