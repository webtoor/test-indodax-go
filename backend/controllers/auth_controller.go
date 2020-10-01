package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/webtoor/test-indodax-go/backend/configs"
	"github.com/webtoor/test-indodax-go/backend/models"
	"golang.org/x/crypto/bcrypt"
)

// ReqLogin ...
type ReqLogin struct {
	Username string `form:"username" json:"username" binding:"required"`
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
	// CHECK USERNAME & EMAIL EXIST
	if check := configs.DB.Where("username = ? OR email = ? ", request.Username, request.Email).First(&user).Error; gorm.IsRecordNotFoundError(check) {
		configs.DB.Create(&newUser)
		c.JSON(http.StatusCreated, gin.H{"status": 201, "message": "Signup berhasil"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "Username atau Email sudah Terdaftar"})
	}
}

// SignIn ...
func SignIn(c *gin.Context) {
	var request ReqLogin
	user := models.User{}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	/* CHECK USERNAME */
	if checkEmail := configs.DB.Where("username = ?", request.Username).First(&user).Error; gorm.IsRecordNotFoundError(checkEmail) {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "invalid_credentials", "message": "Username belum terdaftar, Isi dengan data yang benar dan coba lagi"})
		return
	}

	/* CHECK PASSWORD MATCH */
	checkPswd := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password))
	if checkPswd != nil && checkPswd == bcrypt.ErrMismatchedHashAndPassword {
		c.JSON(http.StatusOK, gin.H{"status": 400, "error": "invalid_credentials", "message": "Password salah. Isi dengan data yang benar dan coba lagi"})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.UserID,
		"username": request.Username,
		"email":    request.Password,
		"nbf":      time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{"access_token": tokenString, "email": user.Email, "username": user.Username, "user_id": user.UserID})

}
