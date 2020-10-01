package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/models"
)

// ReqTransaction ...
type ReqTransaction struct {
	Receiver string `form:"receiver"  json:"receiver" binding:"required"`
	Amount   uint   `form:"amount"  json:"amount" binding:"required"`
}

// FindHistory ...
func FindHistory(c *gin.Context) {
	transaction := []models.Transaction{}
	userID := uint(c.MustGet("jwt_user_id").(float64))
	configs.DB.Preload("Sender").Preload("Receiver").Where("sender_id = ?", userID).Or("receiver_id = ?", userID).Order("transaction_id desc").Find(&transaction)
	c.JSON(http.StatusOK, gin.H{"status": 200, "data": transaction})
}

// CreateTransaction ...
func CreateTransaction(c *gin.Context) {
	var request ReqTransaction
	sender := models.User{}
	receiver := models.User{}
	userID := uint(c.MustGet("jwt_user_id").(float64))

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	configs.DB.Where("user_id = ?", userID).First(&sender)
	configs.DB.Where("username = ?", request.Receiver).First(&receiver)

	if receiver.UserID == 0 {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "Username Penerima Tidak Ditemukan, Isi dengan data yang benar dan coba lagi"})
		return
	}

	if receiver.UserID == userID {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "Anda tidak bisa Transfer ke Akun sendiri"})
		return
	}

	if sender.Saldo < request.Amount {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "Saldo Anda tidak cukup, Isi dengan data yang benar dan coba lagi"})
		return
	}

	senderSaldo := sender.Saldo - request.Amount
	configs.DB.Model(&sender).Where("user_id = ?", userID).Updates(map[string]interface{}{"saldo": senderSaldo})

	receiverSaldo := receiver.Saldo + request.Amount
	configs.DB.Model(&receiver).Where("user_id = ?", receiver.UserID).Updates(map[string]interface{}{"saldo": receiverSaldo})

	transaction := models.Transaction{
		SenderID:   userID,
		ReceivedID: receiver.UserID,
		Amount:     request.Amount,
	}

	configs.DB.Create(&transaction)

	c.JSON(http.StatusOK, gin.H{"status": 201, "data": transaction})

}
