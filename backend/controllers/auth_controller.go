package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/models"
)

// ReqLogin ...
type ReqLogin struct {
	Username string `form:"username" json:"username" binding:"required,username"`
	Password string `form:"password" json:"password" binding:"required"`
}

// ReqRegister ...
type ReqRegister struct {
	Username string `form:"username"  json:"username" binding:"required"`
	Email    string `form:"email"  json:"email" binding:"required,email"`
	Password string `form:"password"  json:"password" binding:"required"`
}

// SignUp ..
func SignUp(c *gin.Context) {
	var request ReqRegister
	user := models.User{}

	// FORM VALIDATION
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": err.Error()})
		return
	}

	newUser := models.User{
		Username: request.Username,
		Email:    request.Email,
	}
	newUser.Password = models.HashAndSalt(request.Password)
	// CHECK EMAIL OR PHONENUMBER EXIST
	if check := configs.DB.Where("username = ? OR email = ? ", request.Username, request.Email).First(&user).Error; gorm.IsRecordNotFoundError(check) {
		configs.DB.Create(&newUser)
		c.JSON(http.StatusCreated, gin.H{"status": 201, "message": "Signup berhasil"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "Username atau Email sudah Terdaftar"})
	}
}
