package models

import (
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// TableName ...
func (User) TableName() string {
	return "users"
}

// User ...
type User struct {
	UserID    uint      `gorm:"primary_key;column:user_id" json:"user_id"`
	Username  string    `gorm:"unique;column:username"  json:"username" binding:"required"`
	Email     string    `gorm:"unique;column:email"  json:"email" binding:"required,email"`
	Password  string    `gorm:"column:password;default:null" json:"password" binding:"required"`
	Saldo     uint      `gorm:"column:saldo"  json:"saldo" binding:"required"`
	CreatedAt time.Time `gorm:"column:created_at;type:datetime"  json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at;type:datetime"  json:"updated_at"`
}

// HashAndSalt ...
func HashAndSalt(pwd string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
	}

	return string(hash)
}
